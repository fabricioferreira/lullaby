import { readFileSync, exists } from 'fs';

export class Configuration {
	private _loaded: boolean = false;
	private _serverPort: number;
	private _apiPath: string;

	public constructor(private _configFilePath: string) {
		this.load().then(() => this._loaded = true);
	}

	get ServerPort(): number {
		return this._serverPort;
	}

	get ApiPath(): string {
		return this._apiPath;
	}

	public load(): Promise<void> {
		let self = this;
		let ret = new Promise<void>(resolve => {
			exists(self._configFilePath, (exists) => {
				if (exists) {
					let configContent = readFileSync(self._configFilePath);
					let config = JSON.parse(configContent.toString());

					self._apiPath = config.ApiPath;
					self._serverPort = config.ServerPort;

					resolve();
				}
				resolve();
			});
		});

		return ret;
	}
}