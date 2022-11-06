import * as sinon from 'sinon';
import {PrimitiveSetting} from "@src/Settings";
import {just, none} from "@sweet-monads/maybe";
import {left, right} from "@sweet-monads/either";

describe('PrimitiveSetting', () => {
	const DEFAULT_VALUE = 'SomeDefaultValue';
	describe('merging', () => {
		const setting = new PrimitiveSetting(DEFAULT_VALUE);

		it('returns default value if no override provided', () => {
			return expect(setting.merge(none()))
				.resolves
				.toEqual(right(DEFAULT_VALUE));
		});

		it('returns last value if override provided', () => {
			return expect(setting.merge(just(['foo', 'bar', 'zee'])))
				.resolves
				.toEqual(right('zee'));
		});

		it('fails if last values is invalid', async () => {
			const validator = sinon.stub().callsFake(value => {
				if (value === 'zee') {
					return left('Invalid value');
				}
				return right(value);
			})
			const setting = new PrimitiveSetting(DEFAULT_VALUE, validator)
			await expect(setting.merge(just(['foo', 'bar', 'zee'])))
				.resolves
				.toMatchSnapshot();
			sinon.assert.calledOnce(validator);
		});

		it('returns value sanitized by validation', async () => {
			const validator = sinon.stub().callsFake(value => {
				return right(value.toUpperCase());
			})
			const setting = new PrimitiveSetting(DEFAULT_VALUE, validator)
			await expect(setting.merge(just(['foo', 'bar', 'zee'])))
				.resolves
				.toEqual(right('ZEE'));
			sinon.assert.calledOnce(validator);
		});
	});
});
