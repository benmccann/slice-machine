import { CallHookWithDetailsReturnType } from "./lib/HookSystem";

/**
 * Gathers values returned by a `callHook()` response. This function is useful
 * when the called hook's ID and owner are not needed.
 *
 * @param callHookWithDetailsReturnValue - The return value from `callHook()`.
 *
 * @returns An array of errors from within `callHookReturnValue`.
 */
export const getHookValues = <
	TCallHookWithDetailsReturnValue extends CallHookWithDetailsReturnType = CallHookWithDetailsReturnType,
>(
	callHookWithDetailsReturnValue: TCallHookWithDetailsReturnValue,
): TCallHookWithDetailsReturnValue["data"][number]["value"][] => {
	return callHookWithDetailsReturnValue.data.map((item) => item.value);
};
