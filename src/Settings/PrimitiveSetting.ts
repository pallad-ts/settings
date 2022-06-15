import {Maybe, Validation} from "monet";
import {Setting} from "../Setting";

export class PrimitiveSetting<TType> extends Setting<TType> {
	async merge(values: Maybe<unknown[]>): Promise<Setting.Validator.Result<TType>> {
		if (values.isNone()) {
			return Validation.Success(this.defaultValue);
		}

		const lastValue = values.some()[values.some().length - 1];
		return this.validator(lastValue);
	}
}
