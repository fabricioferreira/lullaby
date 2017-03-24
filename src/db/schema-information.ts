export class SchemaInformation {
	ConnectionInformation: ConnectionInformation;
	DatabaseName: string;
	Schemas: Schema[];
	Tables: Table[];
}

export class ConnectionInformation {
	ServerName: string;
	DatabaseType: string;
	ConnectionString: string;
}

export class Schema {
	Owner: string;
	Name: string;
}

export class Table {
	Schema: Schema;
	Owner: string;
	Name: string;
	Columns: Column[];
	PrimaryKey: Column[];
}

export class Column {
	Name: string;
	DatabaseType: string;
	Size: number;
	Precision: number;
}