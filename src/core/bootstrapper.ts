import { Configuration } from './configuration';
import { RestServer } from './rest-server';
import { ProviderFactory } from '../db/provider-factory';
import { IProvider } from '../db/provider';
import { SchemaInfo } from '../db/schema-info';

export class Bootstrapper {
	private _server: RestServer;
	private _configuration: Configuration;
	private _initializationComplete: boolean;
	private _provider: IProvider = null;
	private _providerFactory: ProviderFactory = new ProviderFactory();
	private _schemaInfo: SchemaInfo;

	public initialize(configFilePath: string): void {
		this._configuration = new Configuration(configFilePath);

		let self = this;
		this._configuration.load().then(() => {
			self._providerFactory.createProvider(self._configuration.ProviderType,
				this._configuration.ConnectionInfo).then(p => {
					self._provider = p;

					self._provider.getSchemaInfo().then(i => self._schemaInfo = i);

					self._initializationComplete = true;
				});
		});
	}

	public get initializationComplete() {
		return this._initializationComplete;
	}

	public start(): void {
		if (this._initializationComplete) {
			console.log("Started");
		}
		else {
			throw "Inialization not done.";
		}
	}
}