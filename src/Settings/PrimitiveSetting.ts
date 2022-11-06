import {Setting} from "../Setting";
import {dataTypes} from '../';
import {Maybe} from "@sweet-monads/maybe";
import {right} from "@sweet-monads/either";

export class PrimitiveSetting<TType> extends Setting<TType> {
	async merge(values: Maybe<unknown[]>): Promise<Setting.Validator.Result<TType>> {
		if (values.isNone()) {
			return right(this.defaultValue);
		}

		const lastValue = values.value[values.value.length - 1];
		return this.validator(lastValue);
	}

	static string(value: string) {
		return new PrimitiveSetting(value, dataTypes.string);
	}

	static integer(value: number) {
		return new PrimitiveSetting(value, dataTypes.integer);
	}
}
