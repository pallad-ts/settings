import {Setting} from "@src/Setting";
import {Maybe, Validation} from "monet";
import * as sinon from 'sinon';
import {PrimitiveSetting} from "@src/Settings";

describe('PrimitiveSetting', () => {
	const DEFAULT_VALUE = 'SomeDefaultValue';
	describe('merging', () => {
		const setting = new PrimitiveSetting(DEFAULT_VALUE);

		it('returns default value if no override provided', () => {
			return expect(setting.merge(Maybe.None()))
				.resolves
				.toEqual(Validation.Success(DEFAULT_VALUE));
		});

		it('returns last value if override provided', () => {
			return expect(setting.merge(Maybe.Some(['foo', 'bar', 'zee'])))
				.resolves
				.toEqual(Validation.Success('zee'));
		});

		it('fails if last values is invalid', async () => {
			const validator = sinon.stub().callsFake(value => {
				if (value === 'zee') {
					return Validation.Fail('Invalid value');
				}
				return Validation.Success(value);
			})
			const setting = new PrimitiveSetting(DEFAULT_VALUE, validator)
			await expect(setting.merge(Maybe.Some(['foo', 'bar', 'zee'])))
				.resolves
				.toMatchSnapshot();
			sinon.assert.calledOnce(validator);
		});

		it('returns value sanitized by validation', async () => {
			const validator = sinon.stub().callsFake(value => {
				return Validation.Success(value.toUpperCase());
			})
			const setting = new PrimitiveSetting(DEFAULT_VALUE, validator)
			await expect(setting.merge(Maybe.Some(['foo', 'bar', 'zee'])))
				.resolves
				.toEqual(Validation.Success('ZEE'));
			sinon.assert.calledOnce(validator);
		});
	});
});
