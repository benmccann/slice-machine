import type {
	ExtendSliceMachineHook,
	SliceMachinePluginOptions,
	SliceMachineHook,
} from "../types";

/**
 * An object representing a Slice workflow.
 */
export type SliceWorkflow = {
	id: string;
	label: string;
};

/**
 * Data provided to `slice:workflow` hook handlers.
 */
export type SliceWorkflowHookData = undefined;

/**
 * Return value for `slice:workflow` hook handlers.
 */
export type SliceWorkflowHookReturnType = SliceWorkflow;

/**
 * Base version of a `slice:workflow` hook handler without plugin runner
 * context.
 *
 * @internal
 */
export type SliceWorkflowHookBase = SliceMachineHook<
	SliceWorkflowHookData,
	SliceWorkflowHookReturnType
>;

/**
 * Handler for the `slice:workflow` hook. The hook is called to gather Slice
 * workflows.
 *
 * The returned object describes the workflow and how it is presented in UIs.
 *
 * @typeParam TPluginOptions - User-provided options for the hook's plugin.
 */
export type SliceWorkflowHook<
	TPluginOptions extends SliceMachinePluginOptions = SliceMachinePluginOptions,
> = ExtendSliceMachineHook<SliceWorkflowHookBase, TPluginOptions>;
