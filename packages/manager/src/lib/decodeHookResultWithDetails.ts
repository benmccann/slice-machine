import * as t from "io-ts";
import { CallHookDetailedValue } from "@slicemachine/plugin-kit";

import { DecodeError } from "./DecodeError";
import { decode } from "./decode";
import {
	CallHookDetailedError,
	CallHookWithDetailsReturnType,
} from "@slicemachine/plugin-kit";

export const decodeHookResultWithDetails = <
	A,
	O,
	THookResultWithDetails extends Awaited<CallHookWithDetailsReturnType>,
>(
	codec: t.Type<A, O>,
	hookResultWithDetails: THookResultWithDetails,
): {
	data: CallHookDetailedValue<A>[];
	errors: (CallHookDetailedError | DecodeError)[];
} => {
	const data: CallHookDetailedValue<A>[] = [];
	const errors: DecodeError[] = [];

	for (const dataElement of hookResultWithDetails.data) {
		const { value, error } = decode(
			t.type({
				hookID: t.string,
				owner: t.string,
				value: codec,
			}),
			dataElement,
		);

		if (error) {
			errors.push(error);
		} else {
			data.push(value);
		}
	}

	return {
		data,
		errors: [...errors, ...hookResultWithDetails.errors],
	};
};
