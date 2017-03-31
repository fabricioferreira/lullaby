import { SchemaInfo } from './schema-information';

export interface IDatabaseScanner {
	getSchemaInformation(): Promise<SchemaInfo>;
}