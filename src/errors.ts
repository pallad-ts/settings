import {Domain, generators} from "alpha-errors";
import {SettingError} from "./SettingError";

export const ERRORS = Domain.create({
	errorClass: SettingError,
	codeGenerator: generators.formatCode('E_SETTING_%s')
}).createErrors(create => ({
	SETTING_NOT_FOUND: create('Setting not found: %s'),
	INVALID_SETTING_VALUE: create('Invalid setting value: %s')
}));
