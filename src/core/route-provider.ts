import { SchemaInfo } from '../db/schema-info';
import { IProvider } from '../db/provider';

export class RouteProvider {
	constructor() { }

	public createRoutes(schema: SchemaInfo, router: (uri: string) => void): void {
		if (schema === null) return;

		schema.Tables.forEach(table => {
			let uri: string = '/' + table.Name.toLowerCase();

			// As of now, supports only one key
			// or the first column in the key
			if (table.PrimaryKey.length > 0) {
				uri += '/:' + table.PrimaryKey[0].Name.toLowerCase();
			}
			router(uri);
		});
	}
}