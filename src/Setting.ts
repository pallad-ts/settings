import {Maybe, Validation} from "monet";

const DEFAULT_VALIDATOR: Setting.Validator<any> = (value: unknown) => Validation.Success(value);

export abstract class Setting<TType> {
	constructor(protected defaultValue: TType,
				protected validator: Setting.Validator<TType> = DEFAULT_VALIDATOR) {

	}

	abstract merge(values: Maybe<unknown[]>): Promise<Validation<string, TType>>;
}

export namespace Setting {
	export interface Validator<T> {
		(value: unknown): Promise<Validator.Result<T>> | Validator.Result<T>;
	}

	export namespace Validator {
		export type Result<T> = Validation<string, T>;
	}

	export type Type<T extends Setting<any>> = T extends Setting<infer TType> ? TType : never;
}
