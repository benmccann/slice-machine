import * as path from "node:path";

import {
	buildSliceDirectoryPath,
	BuildSliceDirectoryPathArgs,
} from "./buildSliceDirectoryPath";

export type BuildSliceFilePathArgs = {
	filename: string;
} & BuildSliceDirectoryPathArgs;

export async function buildSliceFilePath(
	args: BuildSliceFilePathArgs,
): Promise<string> {
	return path.join(await buildSliceDirectoryPath(args), args.filename);
}
