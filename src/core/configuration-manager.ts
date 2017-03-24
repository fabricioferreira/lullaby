import { readFileSync, exists } from 'fs';

export class Configuration {
	ServerPort: number;
	ApiPath: string;
}

export class ConfigurationManager {
	private _configuration: Configuration;
	private _loaded: boolean = false;

	public constructor(private _configFilePath: string) {
		this.load(() => this._loaded = true);
	}

	public get(): Configuration {
		return this._configuration;
	}

	public load(ready: () => void): void {
		this._configuration = null;

		exists(this._configFilePath, (exists) => {
			if (exists) {
				let configContent = readFileSync(this._configFilePath);
				this._configuration = <Configuration>JSON.parse(configContent.toString());
				if (ready) ready();
			}
		});
	}
}