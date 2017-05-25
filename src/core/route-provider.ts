import { SchemaInfo } from '../db/schema-info';
import { IProvider } from '../db/provider';
import { Route } from './route';

export class RouteProvider {
	constructor() { }

	public createRoutes(schema: SchemaInfo, provider: IProvider): Array<Route> {
		if (schema === null) return [];

		let ret: Array<Route> = schema.Tables.map(table => {
			let uri: string = '/' + table.Name.toLowerCase();

			// As of now, supports only one key
			// or the first column in the key
			if (table.PrimaryKey.length > 0) {
				uri += '/:' + table.PrimaryKey[0].Name.toLowerCase();
			}

			return ({
				Path: uri,
				Handler: provider.getHandler
			});
		});

		return ret;
	}
}