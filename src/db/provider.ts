import { SchemaInfo } from './schema-info';

export interface IProvider {
	getSchemaInfo(): Promise<SchemaInfo>;
	getHandler(req: any, res: any): void;
}