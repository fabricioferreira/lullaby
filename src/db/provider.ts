import { SchemaInfo } from 'db/schema-information';

export interface IProvider {
	getSchemaInfo(): Promise<SchemaInfo>;
}