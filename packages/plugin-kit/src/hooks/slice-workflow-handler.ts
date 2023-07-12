import type { SharedSlice } from "@prismicio/types-internal/lib/customtypes";

import type {
	ExtendSliceMachineHook,
	SliceMachinePluginOptions,
	SliceMachineHook,
	WorkflowResponse,
} from "../types";

/**
 * Data provided to `slice:workflow:handler` hook handlers.
 */
export type SliceWorkflowHandlerHookData = {
	workflowID: string;
	libraryID: string;
	model: SharedSlice;
};

/**
 * Return value for `slice:workflow:handler` hook handlers.
 */
export type SliceWorkflowHandlerHookReturnType = WorkflowResponse | void;

/**
 * Base version of a `slice:workflow:handler` hook handler without plugin runner
 * context.
 *
 * @internal
 */
export type SliceWorkflowHandlerHookBase = SliceMachineHook<
	SliceWorkflowHandlerHookData,
	SliceWorkflowHandlerHookReturnType
>;

/**
 * Handler for the `slice:workflow:handler` hook. The hook is called when a
 * Slice workflow runs.
 *
 * The returned object describes how Slice Machine should react upon running the
 * workflow.
 *
 * @typeParam TPluginOptions - User-provided options for the hook's plugin.
 */
export type SliceWorkflowHandlerHook<
	TPluginOptions extends SliceMachinePluginOptions = SliceMachinePluginOptions,
> = ExtendSliceMachineHook<SliceWorkflowHandlerHookBase, TPluginOptions>;
