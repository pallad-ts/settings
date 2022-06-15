import {Setting} from "../Setting";
import {Validation} from "monet";

export const integer: Setting.Validator<number> = (value: unknown) => {
	if (!Number.isSafeInteger(value)) {
		return Validation.Fail(`${value} is not a safe integer`);
	}
	return Validation.Success(value as number);
}
