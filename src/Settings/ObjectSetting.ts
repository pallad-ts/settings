import {Setting} from "../Setting";
import {Maybe} from "@sweet-monads/maybe";
import {right} from "@sweet-monads/either";

export class ObjectSetting<TType extends Record<any, any>> extends Setting<TType> {
	async merge(values: Maybe<unknown[]>): Promise<Setting.Validator.Result<TType>> {
		if (values.isNone()) {
			return right(this.defaultValue);
		}

		let currentValue = {
			...this.defaultValue
		};

		for (const override of values.value) {
			const validationResult = await this.validator({
				...currentValue,
				...override as {}
			});
			if (validationResult.isLeft()) {
				return validationResult;
			}
			currentValue = validationResult.value;
		}
		return right(currentValue);
	}
}
