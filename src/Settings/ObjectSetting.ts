import {Maybe, Validation} from "monet";
import {Setting} from "../Setting";

export class ObjectSetting<TType extends Record<any, any>> extends Setting<TType> {
	async merge(values: Maybe<unknown[]>): Promise<Setting.Validator.Result<TType>> {
		if (values.isNone()) {
			return Validation.Success(this.defaultValue);
		}

		let currentValue = {
			...this.defaultValue
		};

		for (const override of values.some()) {
			const validationResult = await this.validator({
				...currentValue,
				...override as {}
			});
			if (validationResult.isFail()) {
				return validationResult;
			}
			currentValue = validationResult.success();
		}
		return Validation.Success(currentValue);
	}
}
