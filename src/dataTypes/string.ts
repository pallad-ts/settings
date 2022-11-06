import {Setting} from "../Setting";
import {left, right} from "@sweet-monads/either";

export const string: Setting.Validator<string> = value => {
	if (typeof value !== 'string') {
		return left(`${value} is not a string`);
	}
	return right(value.trim());
}
