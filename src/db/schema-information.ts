export class SchemaInfo {
	DatabaseName: string;
	Tables: Table[];
}

export class Table {
	Schema: string;
	Id: number;
	Name: string;
	Columns: Column[];
	PrimaryKey: Column[];
	constructor(table: Table) {
		Object.assign(this, table);
	}
}

export class Column {
	TableId: number;
	Name: string;
	DatabaseType: string;
	Size: number;
	Precision: number;
	constructor(column: Column) {
		Object.assign(this, column);
	}
}