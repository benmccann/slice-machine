import { CallHookWithDetailsReturnType } from "./lib/HookSystem";

/**
 * Gathers errors returned by a `callHook()` response. This function is useful
 * when the called hook's ID and owner are not needed.
 *
 * @param callHookReturnValue - The return value from `callHook()`.
 *
 * @returns An array of values from within `callHookReturnValue`.
 */
export const getHookErrors = <
	TCallHookWithDetailsReturnType extends CallHookWithDetailsReturnType = CallHookWithDetailsReturnType,
>(
	callHookWithDetailsReturnValue: TCallHookWithDetailsReturnType,
): TCallHookWithDetailsReturnType["errors"][number]["error"][] => {
	return callHookWithDetailsReturnValue.errors.map((item) => item.error);
};
