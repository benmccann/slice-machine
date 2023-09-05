import fs from "fs";
import type { SharedSlice } from "@prismicio/types-internal/lib/customtypes";

export const mocks = "";

export const createComponentContents = (
	isTypeScriptProject: boolean,
): string => {
	return isTypeScriptProject ? "t = true" : "t = false";
};

export const model: SharedSlice = {
	id: "call_to_action",
	type: "SharedSlice",
	name: "CallToAction",
	description: "CallToAction",
	variations: [
		{
			id: "default",
			name: "Default",
			docURL: "...",
			version: "initial",
			description: "Default",
			imageUrl: "",
			primary: {
				image: {
					type: "Image",
					config: { label: "Image", constraint: {}, thumbnails: [] },
				},
				title: {
					type: "StructuredText",
					config: {
						label: "title",
						placeholder: "",
						allowTargetBlank: true,
						single: "heading1,heading2,heading3,heading4,heading5,heading6",
					},
				},
				paragraph: {
					type: "StructuredText",
					config: {
						label: "paragraph",
						placeholder: "",
						allowTargetBlank: true,
						single:
							"paragraph,preformatted,strong,em,hyperlink,image,embed,list-item,o-list-item,rtl",
					},
				},
				buttonlink: {
					type: "Link",
					config: {
						label: "buttonLink",
						placeholder: "Redirect URL for CTA button",
						allowTargetBlank: true,
						select: null,
					},
				},
				buttonLabel: {
					type: "Text",
					config: {
						label: "buttonLabel",
						placeholder: "Label for CTA button",
					},
				},
			},
			items: {},
		},
		{
			id: "alignLeft",
			name: "AlignLeft",
			docURL: "...",
			version: "initial",
			description: "Default",
			imageUrl: "",
			primary: {
				image: {
					type: "Image",
					config: { label: "Image", constraint: {}, thumbnails: [] },
				},
				title: {
					type: "StructuredText",
					config: {
						label: "title",
						placeholder: "",
						allowTargetBlank: true,
						single: "heading1,heading2,heading3,heading4,heading5,heading6",
					},
				},
				paragraph: {
					type: "StructuredText",
					config: {
						label: "paragraph",
						placeholder: "",
						allowTargetBlank: true,
						single:
							"paragraph,preformatted,strong,em,hyperlink,image,embed,list-item,o-list-item,rtl",
					},
				},
				buttonlink: {
					type: "Link",
					config: {
						label: "buttonLink",
						placeholder: "Redirect URL for CTA button",
						allowTargetBlank: true,
						select: null,
					},
				},
				buttonLabel: {
					type: "Text",
					config: {
						label: "buttonLabel",
						placeholder: "Label for CTA button",
					},
				},
			},
			items: {},
		},
	],
};

export const screenshots = {};
