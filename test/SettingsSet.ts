import {SettingsSet} from "@src/SettingsSet";
import {OverrideProvider} from "@src/OverrideProvider";
import {assert, IsExact} from 'conditional-type-checks';
import {PrimitiveSetting} from "@src/Settings";
import * as sinon from 'sinon';
import {just, none} from "@sweet-monads/maybe";
import {Either, left, right} from "@sweet-monads/either";

describe('SettingsSet', () => {
	const NOOP_OVERRIDE_PROVIDER: OverrideProvider<any> = (name, target) => {
		return Promise.resolve(none());
	}

	describe('resolving', () => {
		it('fails if settings with given name does not exist', () => {
			const set = new SettingsSet({}, NOOP_OVERRIDE_PROVIDER);

			return expect(set.resolveSetting('goo' as any, {}))
				.rejects
				.toMatchInlineSnapshot();
		});

		it('returns override merged through setting', async () => {
			const merge = sinon.stub();
			const setting = new PrimitiveSetting('foo');
			setting.merge = merge;
			const set = new SettingsSet({
				foo: setting
			}, () => {
				return just(['bar']);
			});

			await expect(set.resolveSetting('foo', {}))
				.resolves
				.toEqual('bar');
			sinon.assert.calledWith(merge, just(['bar']));
		});

		it('fails if setting merge fails', async () => {
			const setting = new PrimitiveSetting('foo');
			setting.merge = () => {
				return Promise.resolve(left('Error'));
			};

			const set = new SettingsSet({
				foo: setting
			}, () => {
				return just('bar');
			});

			await expect(set.resolveSetting('foo', {}))
				.resolves
				.toEqual(left('Error'));
		});

		it('converts override value to array if not already an array', async () => {
			const merge = sinon.stub();
			const setting = new PrimitiveSetting('foo');
			// eslint-disable-next-line @typescript-eslint/require-await
			setting.merge = async () => {
				return right('ok');
			};

			const set = new SettingsSet({
				foo: setting
			}, () => {
				return just('bar');
			});

			await set.resolveSetting('foo', {});
			sinon.assert.calledWith(merge, just(['bar']));
		});
	});

	describe('types', () => {
		describe('resolves setting type', () => {
			const set = new SettingsSet({
				foo: PrimitiveSetting.integer(10),
				bar: PrimitiveSetting.string('zee'),
			}, NOOP_OVERRIDE_PROVIDER);

			it('foo', async () => {
				const result = await set.resolveSetting('foo' as const, {});

				type Input = typeof result;
				type Expected = Either<string, number>;
				assert<IsExact<Input, Expected>>(true);
			});

			it('bar', async () => {
				const result = await set.resolveSetting('bar' as const, {});

				type Input = typeof result;
				type Expected = Either<string, string>;
				assert<IsExact<Input, Expected>>(true);
			});
		});
	});
});
