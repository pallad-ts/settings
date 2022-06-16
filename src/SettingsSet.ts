import {Setting} from "./Setting";
import {OverrideProvider} from "./OverrideProvider";
import {ERRORS} from "./errors";
import {Validation} from "monet";

export class SettingsSet<TNames extends string, T extends Record<TNames, Setting<unknown>>> {
	private settingsMap = new Map<string, Setting<unknown>>(Object.entries(this.settings));

	constructor(readonly settings: T,
				readonly overrideProvider: OverrideProvider<TNames>) {
	}

	async resolveSetting<TName extends TNames>(name: TName, target: unknown) {
		const setting = this.assertSettingByName(name);
		const override = await this.overrideProvider(name, target);
		const finalOverride = override.map(x => Array.isArray(x) ? x : [x]);
		return await setting.merge(finalOverride) as Validation<string, Setting.Type<T[TName]>>;
	}

	async resolveSettingOrFail<TName extends TNames>(name: TName, target: unknown) {
		const result = await this.resolveSetting<TName>(name, target);
		result.forEachFail(x => {
			throw ERRORS.INVALID_SETTING_VALUE.format(x);
		})
		return result.success();
	}

	private assertSettingByName(name: TNames) {
		const setting = this.settingsMap.get(name);
		if (!setting) {
			throw ERRORS.SETTING_NOT_FOUND.format(name);
		}
		return setting as T[TNames];
	}
}
