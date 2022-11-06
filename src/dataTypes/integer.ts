import {Setting} from "../Setting";
import {left, right} from "@sweet-monads/either";

export const integer: Setting.Validator<number> = (value: unknown) => {
	if (!Number.isSafeInteger(value)) {
		return left(`${value} is not a safe integer`);
	}
	return right(value as number);
}
