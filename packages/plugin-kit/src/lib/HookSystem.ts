import { getHookErrors } from "../getHookErrors";
import { getHookValues } from "../getHookValues";

/**
 * Extends a function arguments with extra ones.
 */
type FnWithExtraArgs<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	F extends (...args: any[]) => any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TExtraArgs extends any[] = any[],
> = (
	...args: [...args: Parameters<F>, ...extraArgs: TExtraArgs]
) => ReturnType<F>;

/**
 * Defines a hook handler.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HookFn<TArgs extends any[] = any[], TReturn = any> = (
	...args: TArgs
) => Promise<TReturn> | TReturn;

/**
 * Generic hook metadata.
 */
type HookMeta = Record<string, unknown>;

/**
 * Defines a hook, including its function handler and optional metadata.
 */
export type Hook<
	THookFn extends HookFn = HookFn,
	THookMeta extends HookMeta = HookMeta,
> = {
	fn: THookFn;
	meta?: THookMeta;
};

/**
 * Represents a map of hook types to hook functions and metas.
 */
type Hooks = Record<string, Hook>;

/**
 * Builds hook meta arguments after hook meta requirements.
 */
type HookMetaArg<THookMeta extends Record<string, unknown> | undefined> =
	THookMeta extends Record<string, unknown>
		? [meta: THookMeta]
		: [meta?: never];

/**
 * Represents a value returned by a hook.
 *
 * @internal
 */
export type CallHookDetailedValue<TValue = unknown> = {
	hookID: string;
	owner: string;
	value: TValue;
};

/**
 * Represents an error thrown by a hook.
 *
 * @internal
 */
export type CallHookDetailedError = {
	hookID: string;
	owner: string;
	error: HookError;
};

/**
 * Defines the return type of the {@link HookSystem.callHookWithDetails}
 * functions.
 *
 * @internal
 */
export type CallHookWithDetailsReturnType<THookFn extends HookFn = HookFn> = {
	data: CallHookDetailedValue<Awaited<ReturnType<THookFn>>>[];
	errors: CallHookDetailedError[];
};

/**
 * Defines the return type of the {@link HookSystem.callHook} functions.
 *
 * @internal
 */
export type CallHookReturnType<THookFn extends HookFn = HookFn> = {
	data: Awaited<ReturnType<THookFn>>[];
	errors: HookError[];
};

/**
 * Defines the return type of the {@link HookSystem.createScope} functions.
 *
 * @internal
 */
export type CreateScopeReturnType<
	THooks extends Hooks = Record<string, { fn: HookFn }>,
	TExtraArgs extends unknown[] = never[],
> = {
	hook: <TType extends keyof THooks>(
		type: TType,
		hookFn: FnWithExtraArgs<THooks[TType]["fn"], TExtraArgs>,
		...[meta]: HookMetaArg<THooks[TType]["meta"]>
	) => ReturnType<HookSystem["hook"]>;
	unhook: HookSystem<{
		[P in keyof THooks]: Omit<THooks[P], "fn"> & {
			fn: FnWithExtraArgs<THooks[P]["fn"], TExtraArgs>;
		};
	}>["unhook"];
};

type RegisteredHookMeta = {
	id: string;
	type: string;
	owner: string;
	external?: HookFn;
};

/**
 * Represents a registered hook.
 */
type RegisteredHook<THook extends Hook = Hook> = {
	fn: THook["fn"];
	meta: THook["meta"] extends Record<string, unknown>
		? RegisteredHookMeta & THook["meta"]
		: RegisteredHookMeta;
};

export class HookError<TError = Error | unknown> extends Error {
	type: string;
	owner: string;
	rawMeta: RegisteredHookMeta;
	rawCause: TError;

	constructor(meta: RegisteredHookMeta, cause: TError) {
		super(
			`Error in \`${meta.owner}\` during \`${meta.type}\` hook: ${
				cause instanceof Error ? cause.message : String(cause)
			}`,
		);

		this.type = meta.type;
		this.owner = meta.owner;
		this.rawMeta = meta;
		this.rawCause = cause;
		this.cause = cause instanceof Error ? cause : undefined;
	}
}

const uuid = (): string => {
	return (++uuid.i).toString();
};
uuid.i = 0;

/**
 * @internal
 */
export class HookSystem<THooks extends Hooks = Hooks> {
	private _registeredHooks: {
		[K in keyof THooks]?: RegisteredHook<THooks[K]>[];
	} = {};

	hook<TType extends keyof THooks>(
		owner: string,
		type: TType,
		hookFn: THooks[TType]["fn"],
		...[meta]: HookMetaArg<THooks[TType]["meta"]>
	): string {
		const id = uuid();

		const registeredHook = {
			fn: hookFn,
			meta: {
				...meta,
				owner,
				type,
				id,
			},
		} as RegisteredHook<THooks[TType]>;

		const registeredHooksForType = this._registeredHooks[type];

		if (registeredHooksForType) {
			registeredHooksForType.push(registeredHook);
		} else {
			this._registeredHooks[type] = [registeredHook];
		}

		return id;
	}

	unhook<TType extends keyof THooks>(
		type: TType,
		hookFn: THooks[TType]["fn"],
	): void {
		this._registeredHooks[type] = this._registeredHooks[type]?.filter(
			(registeredHook) => registeredHook.fn !== hookFn,
		);
	}

	async callHook<TType extends Extract<keyof THooks, string>>(
		hookDescriptor:
			| TType
			| { type: TType; hookID: string }
			| { type: TType; owner: string },
		...args: Parameters<THooks[TType]["fn"]>
	): Promise<CallHookReturnType<THooks[TType]["fn"]>> {
		const hookResults = await this.callHookWithDetails(hookDescriptor, ...args);

		return {
			data: getHookValues(hookResults),
			errors: getHookErrors(hookResults),
		};
	}

	async callHookWithDetails<TType extends Extract<keyof THooks, string>>(
		hookDescriptor:
			| TType
			| { type: TType; hookID: string }
			| { type: TType; owner: string },
		...args: Parameters<THooks[TType]["fn"]>
	): Promise<CallHookWithDetailsReturnType<THooks[TType]["fn"]>> {
		let hooks: RegisteredHook<THooks[TType]>[];

		if (typeof hookDescriptor === "string") {
			hooks = this._registeredHooks[hookDescriptor] ?? [];
		} else if ("hookID" in hookDescriptor) {
			const hookForID = this._registeredHooks[hookDescriptor.type]?.find(
				(hook) => hook.meta.id === hookDescriptor.hookID,
			);

			if (hookForID) {
				hooks = [hookForID];
			} else {
				throw new Error(
					`Hook of type \`${hookDescriptor.type}\` with ID \`${hookDescriptor.hookID}\` not found.`,
				);
			}
		} else if ("owner" in hookDescriptor) {
			hooks = this.hooksForOwner(hookDescriptor.owner).filter(
				(hook): hook is RegisteredHook<THooks[TType]> =>
					hook.meta.type === hookDescriptor.type,
			);
		} else {
			throw new Error(
				"Invalid hook descriptor. Provide a type, hook ID, or owner.",
			);
		}

		const promises = hooks.map(async (hook) => {
			try {
				const value = await hook.fn(...args);

				return {
					hookID: hook.meta.id,
					owner: hook.meta.owner,
					value,
				};
			} catch (error) {
				throw {
					hookID: hook.meta.id,
					owner: hook.meta.owner,
					error: new HookError(hook.meta, error),
				};
			}
		});

		const settledPromises = await Promise.allSettled(promises);

		return settledPromises.reduce<
			Awaited<CallHookWithDetailsReturnType<THooks[TType]["fn"]>>
		>(
			(acc, settledPromise) => {
				if (settledPromise.status === "fulfilled") {
					acc.data.push(settledPromise.value);
				} else {
					acc.errors.push(settledPromise.reason);
				}

				return acc;
			},
			{ data: [], errors: [] },
		);
	}

	/**
	 * Returns list of hooks for a given owner
	 */
	hooksForOwner(owner: string): RegisteredHook<THooks[string]>[] {
		const hooks: RegisteredHook<THooks[string]>[] = [];

		for (const hookType in this._registeredHooks) {
			const registeredHooks = this._registeredHooks[hookType];

			if (Array.isArray(registeredHooks)) {
				for (const registeredHook of registeredHooks) {
					if (registeredHook.meta.owner === owner) {
						hooks.push(registeredHook);
					}
				}
			}
		}

		return hooks;
	}

	/**
	 * Returns list of hooks for a given type
	 */
	hooksForType<TType extends keyof THooks>(
		type: TType,
	): RegisteredHook<THooks[TType]>[] {
		return this._registeredHooks[type] ?? [];
	}

	createScope<TExtraArgs extends unknown[] = never[]>(
		owner: string,
		extraArgs: [...TExtraArgs],
	): CreateScopeReturnType<THooks, TExtraArgs> {
		return {
			hook: (type, hookFn, ...[meta]) => {
				const internalHook = ((
					...args: Parameters<THooks[typeof type]["fn"]>
				) => {
					return hookFn(...args, ...extraArgs);
				}) as THooks[typeof type]["fn"];

				const resolvedMeta = {
					...meta,
					external: hookFn,
				} as HookMetaArg<THooks[typeof type]["meta"]>[0];

				return this.hook(
					owner,
					type,
					internalHook,
					// @ts-expect-error - TypeScript fails to assert rest argument.
					resolvedMeta,
				);
			},
			unhook: (type, hookFn) => {
				this._registeredHooks[type] = this._registeredHooks[type]?.filter(
					(registeredHook) => registeredHook.meta.external !== hookFn,
				);
			},
		};
	}
}
