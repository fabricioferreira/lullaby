import { SchemaInformation } from './schema-information';

export interface IDatabaseScanner {
	getSchema(): Promise<SchemaInformation>;
}