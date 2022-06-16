import {Maybe, Validation} from "monet";
import {Setting} from "../Setting";
import {dataTypes} from '../';

export class PrimitiveSetting<TType> extends Setting<TType> {
	async merge(values: Maybe<unknown[]>): Promise<Setting.Validator.Result<TType>> {
		if (values.isNone()) {
			return Validation.Success(this.defaultValue);
		}

		const lastValue = values.some()[values.some().length - 1];
		return this.validator(lastValue);
	}

	static string(value: string) {
		return new PrimitiveSetting(value, dataTypes.string);
	}

	static integer(value: number) {
		return new PrimitiveSetting(value, dataTypes.integer);
	}
}
