import { readFileSync, exists } from 'fs';
import { ConnectionInfo } from '../db/connection-info';

export class Configuration {
	private _serverPort: number;
	private _apiPath: string;
	private _providerType: string;
	private _connectionInfo: ConnectionInfo;

	public constructor(private _configFilePath: string) { }

	get ServerPort(): number {
		return this._serverPort;
	}

	get ApiPath(): string {
		return this._apiPath;
	}

	get ProviderType(): string {
		return this._providerType;
	}

	get ConnectionInfo(): ConnectionInfo {
		return this._connectionInfo;
	}

	public load(): Promise<void> {
		let self = this;
		let ret = new Promise<void>((resolve, reject) => {
			exists(self._configFilePath, (exists) => {
				if (exists) {
					let configContent = readFileSync(self._configFilePath);
					let config = JSON.parse(configContent.toString());

					self._apiPath = config.ApiPath;
					self._serverPort = config.ServerPort;
					self._providerType = config.ProviderType;
					self._connectionInfo = new ConnectionInfo({
						Server: config.ConnectionInfo.Server,
						Database: config.ConnectionInfo.Database,
						UserName: config.ConnectionInfo.UserName,
						Password: config.ConnectionInfo.Password,
						ConnectionTimeout: config.ConnectionInfo.ConnectionTimeout,
						RequestTimeout: config.ConnectionInfo.RequestTimeout
					});
				} else {
					reject(`Configuration file ${self._configFilePath} not found!`);
				}
				resolve();
			});
		});

		return ret;
	}
}