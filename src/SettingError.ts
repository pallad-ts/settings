export class SettingError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'SettingError';
		this.message = message;
	}
}
