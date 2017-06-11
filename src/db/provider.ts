import { SchemaInfo } from './schema-info';

export interface IProvider {
	setSchemaInfo(info: SchemaInfo): void;
	handler(): any;
	getSchemaInfo(): Promise<SchemaInfo>;
	createResultObject(baseUrl: any, parameters: any): Promise<string>;
}