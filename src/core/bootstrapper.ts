import { Configuration } from './configuration';
import { RestServer } from './rest-server';
import { ProviderFactory } from '../db/provider-factory';
import { IProvider } from '../db/provider';
import { SchemaInfo } from '../db/schema-info';
import { RouteProvider } from './route-provider';
import { Application, IRoute } from '@types/express';
import { Route } from './route';

export class Bootstrapper {
	private _server: RestServer;
	private _configuration: Configuration;
	private _initializationComplete: boolean;
	private _provider: IProvider = null;
	private _providerFactory: ProviderFactory = new ProviderFactory();
	private _schemaInfo: SchemaInfo;
	private _routeProvider: RouteProvider = new RouteProvider();
	private _express: Application = require('express')();

	public initialize(configFilePath: string): Promise<void> {
		this._configuration = new Configuration(configFilePath);

		let self = this;
		var ret = new Promise<void>(resolve => {
			self._configuration.load().then(() => {
				self._providerFactory.createProvider(self._configuration.ProviderType,
					self._configuration.ConnectionInfo).then(p => {
						self._provider = p;

						self._provider.getSchemaInfo().then(i => {
							self._schemaInfo = i;
							self._initializationComplete = true;

							let routes = self._routeProvider.createRoutes(i, p);
							routes.forEach(r => {
								self._express.get(r.Path, r.Handler);
							});

							self._express.get('/__routes', (req, res) => {
								res.write(JSON.stringify(routes));
								res.end();
							});

							resolve();
						});
					});
			});
		});

		return ret;
	}

	public get initializationComplete() {
		return this._initializationComplete;
	}

	public start(): void {
		if (this._initializationComplete) {
			this._express.listen(this._configuration.ServerPort,
				() => console.log("Listen on port ", this._configuration.ServerPort));
		}
		else {
			throw "Inialization not done.";
		}
	}
}