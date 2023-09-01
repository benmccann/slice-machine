import type { SharedSlice } from "@prismicio/types-internal/lib/customtypes";

import type {
	ExtendSliceMachineHook,
	SliceMachinePluginOptions,
	SliceMachineHook,
} from "../types";

/**
 * Data provided to `slice-template-library:read` hook handlers.
 */
export type SliceTemplateLibraryReadHookData = {
	templateIds?: string[];
};

/**
 * Return value for `slice-template-library:read` hook handlers.
 */
export type SliceTemplateLibraryReadHookReturnType = {
	templates: {
		model: SharedSlice;
		mocks: string;
		componentContents: string;
		screenshots: Record<string, Buffer>;
	}[];
};

/**
 * Base version of `slice-template-library:read` without plugin runner context.
 *
 * @internal
 */
export type SliceTemplateLibraryReadHookBase = SliceMachineHook<
	SliceTemplateLibraryReadHookData,
	SliceTemplateLibraryReadHookReturnType
>;

/**
 * Handler for the `slice-template-library:read` hook.
 *
 * @typeParam TPluginOptions - User-provided options for the hook's plugin.
 */
export type SliceTemplateLibraryReadHook<
	TPluginOptions extends SliceMachinePluginOptions = SliceMachinePluginOptions,
> = ExtendSliceMachineHook<SliceTemplateLibraryReadHookBase, TPluginOptions>;
