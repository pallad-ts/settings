import {Either, right} from "@sweet-monads/either";
import {Maybe} from "@sweet-monads/maybe";

const DEFAULT_VALIDATOR: Setting.Validator<any> = (value: unknown) => right(value);

export abstract class Setting<TType> {
	constructor(protected defaultValue: TType,
				protected validator: Setting.Validator<TType> = DEFAULT_VALIDATOR) {

	}

	abstract merge(values: Maybe<unknown[]>): Promise<Either<string, TType>>;
}

export namespace Setting {
	export interface Validator<T> {
		(value: unknown): Promise<Validator.Result<T>> | Validator.Result<T>;
	}

	export namespace Validator {
		export type Result<T> = Either<string, T>;
	}

	export type Type<T extends Setting<any>> = T extends Setting<infer TType> ? TType : never;
}
