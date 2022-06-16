import {Setting} from "../Setting";
import {Validation} from "monet";

export const string: Setting.Validator<string> = value => {
	if (typeof value !== 'string') {
		return Validation.Fail(`${value} is not a string`);
	}
	return Validation.Success(value.trim());
}
