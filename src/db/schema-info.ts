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
	AssociatedRoute: string;
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
	IsPrimaryKey: boolean;
	constructor(column: Column) {
		Object.assign(this, column);
	}
}