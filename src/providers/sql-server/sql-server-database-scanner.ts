import { IDatabaseScanner } from '../../db/database-scanner';
import { SchemaResolver } from '../../db/schema-resolver';
import { SchemaInfo, Table, Column } from '../../db/schema-information';
import { SqlServerConnectionInfo } from './sql-server-connectoin-info';
import { SqlServerMetadataQueries } from './sql-server-constants';
import { Connection, Request, config } from 'mssql';
import * as _ from 'lodash';

export class SqlServerDatabaseScanner implements IDatabaseScanner {

	public constructor(private connectionInfo: SqlServerConnectionInfo,
		private schemaResolver: SchemaResolver) { }

	public getSchemaInformation(): Promise<SchemaInfo> {
		let connection = this.createConnection();

		let ret = new Promise<SchemaInfo>(resolve => {
			connection.then(c => {
				Promise.all([this.retrieveAllTables(c), this.retrieveAllColumns(c)])
					.then(values => {
						let tables = values[0];
						let columns = values[1];

						let schemaInfo: SchemaInfo = this.schemaResolver.resolve(tables, columns);

						resolve(schemaInfo);
					});
			});
		});

		return ret;
	}

	private retrieveAllTables(connection: Connection): Promise<Table[]> {
		let ret = new Promise<Table[]>(resolve => {
			let req = new Request(connection);
			let sql = SqlServerMetadataQueries.SYS_TABLES;

			req.query(sql).then(recordset => {
				let tables: Table[] = [];
				for (let i = 0; i < recordset.length; i++) {
					let record = recordset[i];
					let table = new Table({
						Id: record.table_id,
						Name: record.table_name,
						Columns: null,
						PrimaryKey: null,
						Schema: record.schema_name
					});
					tables.push(table);
				}

				resolve(tables);
			}, rejected => {
				throw rejected;
			});
		});

		return ret;
	}

	private retrieveAllColumns(connection: Connection): Promise<Column[]> {
		let ret = new Promise<Column[]>(resolve => {
			let req = new Request(connection);
			let sql = SqlServerMetadataQueries.SYS_COLUMS;
			req.query(sql).then(recordset => {
				let columns: Column[] = [];
				for (let i = 0; i < recordset.length; i++) {
					let record = recordset[i];
					let column = new Column({
						TableId: record.table_id,
						Name: record.column_name,
						DatabaseType: record.type_name,
						Size: record.max_length,
						Precision: record.precision
					});
					columns.push(column);
				}
				resolve(columns);
			}, rejected => {
				throw rejected;
			});
		});
		return ret;
	}

	private createConnection(): Promise<Connection> {
		let c = this.createConnectionConfig();

		let connection = new Connection(c);

		return connection.connect();
	}

	private createConnectionConfig(): config {
		let cf: config = {
			server: this.connectionInfo.Server,
			user: this.connectionInfo.UserName,
			password: this.connectionInfo.Password,
			database: this.connectionInfo.Database
		};

		return cf;
	}
}