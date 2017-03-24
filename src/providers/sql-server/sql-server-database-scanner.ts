import { IDatabaseScanner } from '../../db/database-scanner';
import { SchemaInformation } from '../../db/schema-information';
import { Connection } from 'mssql';

export class SqlServerDatabaseScanner implements IDatabaseScanner {
	private _connected: boolean = false;
	private _sql = require('mssql');

	public constructor(private _connectionString: string) { }

	public getSchema(): SchemaInformation {
		if (!this._connected) {
			this.connect();
		}
		return null;
	}

	private connect(): void {

	}
}