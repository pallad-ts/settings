import {ObjectSetting} from "@src/Settings/ObjectSetting";
import {Maybe, Validation} from "monet";
import * as sinon from 'sinon';

describe('ObjectSetting', () => {
	const DEFAULT_VALUE = {
		foo: 'bar',
		zee: 'bee'
	};

	const DEFAULT_VALUE_COPY = JSON.parse(JSON.stringify(DEFAULT_VALUE));

	describe('merging', () => {
		const setting = new ObjectSetting(DEFAULT_VALUE);

		it('returns default values if no override provided', () => {
			return expect(setting.merge(Maybe.None()))
				.resolves
				.toEqual(Validation.Success(DEFAULT_VALUE));
		});

		it('fails if validation fails at any stage or merging', () => {
			const validator = sinon.stub().callsFake(value => {
				if (value.foo === 'test') {
					return Validation.Fail('Invalid value foo');
				}
				return Validation.Success(value);
			});

			const setting = new ObjectSetting(DEFAULT_VALUE, validator);

			return expect(setting.merge(Maybe.Some([{foo: 'test'}, {foo: 'bar'}])))
				.resolves
				.toMatchSnapshot();
		});

		it('returns value sanitized by validation', () => {
			const validator = sinon.stub().callsFake(value => {
				return Validation.Success(
					Object.fromEntries(
						Object.entries(value)
							.map(([key, value]) => [key, (value as string).toUpperCase()])
					)
				)
			});

			const setting = new ObjectSetting(DEFAULT_VALUE, validator);

			return expect(setting.merge(Maybe.Some([{foo: 'fee'}, {zee: 'boo'}])))
				.resolves
				.toEqual(Validation.Success({foo: 'FEE', zee: 'BOO'}));
		});

		afterEach(() => {
			expect(DEFAULT_VALUE).toEqual(DEFAULT_VALUE_COPY);
		});
	});
})
