import { Configuration } from 'core/configuration';
import { RestServer } from 'core/rest-server';

export class Bootstrapper {
	private _server: RestServer;
	private _configuration: Configuration;
	private _initializationComplete: boolean;

	public initialize(configFilePath: string): void {
		this._configuration = new Configuration(configFilePath);

		let self = this;
		this._configuration.load().then(() => self._initializationComplete = true);


	}

	public get initializationComplete() {
		return this._initializationComplete;
	}
}