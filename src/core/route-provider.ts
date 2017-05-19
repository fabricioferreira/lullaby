import { SchemaInfo } from '../db/schema-info';
import { Route } from './route';

export class RouteProvider {
	constructor() { }

	public createRoutes(schema: SchemaInfo): Promise<Route[]> {
		return null;
	}
}