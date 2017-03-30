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
	constructor(schema: Schema) {
		Object.assign(this, schema);
	}
}

export class Table {
	Schema: Schema;
	Id: number;
	Name: string;
	Columns: Column[];
	PrimaryKey: Column[];
	constructor(table: Table) {
		Object.assign(this, table);
	}
}

export class Column {
	Name: string;
	DatabaseType: string;
	Size: number;
	Precision: number;
	constructor(column: Column) {
		Object.assign(this, column);
	}
}