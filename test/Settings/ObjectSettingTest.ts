import {ObjectSetting} from "@src/Settings/ObjectSetting";
import * as sinon from 'sinon';
import {just, none} from "@sweet-monads/maybe";
import {left, right} from "@sweet-monads/either";

describe('ObjectSetting', () => {
	const DEFAULT_VALUE = {
		foo: 'bar',
		zee: 'bee'
	};

	const DEFAULT_VALUE_COPY = JSON.parse(JSON.stringify(DEFAULT_VALUE));

	describe('merging', () => {
		const setting = new ObjectSetting(DEFAULT_VALUE);

		it('returns default values if no override provided', () => {
			return expect(setting.merge(none()))
				.resolves
				.toEqual(right(DEFAULT_VALUE));
		});

		it('fails if validation fails at any stage or merging', () => {
			const validator = sinon.stub().callsFake(value => {
				if (value.foo === 'test') {
					return left('Invalid value foo');
				}
				return right(value);
			});

			const setting = new ObjectSetting(DEFAULT_VALUE, validator);

			return expect(setting.merge(just([{foo: 'test'}, {foo: 'bar'}])))
				.resolves
				.toMatchSnapshot();
		});

		it('returns value sanitized by validation', () => {
			const validator = sinon.stub().callsFake(value => {
				return right(
					Object.fromEntries(
						Object.entries(value)
							.map(([key, value]) => [key, (value as string).toUpperCase()])
					)
				)
			});

			const setting = new ObjectSetting(DEFAULT_VALUE, validator);

			return expect(setting.merge(just([{foo: 'fee'}, {zee: 'boo'}])))
				.resolves
				.toEqual(right({foo: 'FEE', zee: 'BOO'}));
		});

		afterEach(() => {
			expect(DEFAULT_VALUE).toEqual(DEFAULT_VALUE_COPY);
		});
	});
})
