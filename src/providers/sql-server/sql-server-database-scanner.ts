import { IDatabaseScanner } from '../../db/database-scanner';
import { SchemaInformation, Schema, Table, Column } from '../../db/schema-information';
import { SqlServerConnectionInfo } from './sql-server-connectoin-info';
import { SqlServerMetadataQueries } from './sql-server-constants';
import { Connection, Request, config } from 'mssql';
import * as _ from 'lodash';

export class SqlServerDatabaseScanner implements IDatabaseScanner {

	public constructor(private connectionInfo: SqlServerConnectionInfo) { }

	public getSchema(): Promise<SchemaInformation> {
		let connection = this.createConnection();

		let ret = new Promise<SchemaInformation>(resolve => {
			let schemaInfo = new SchemaInformation();

			connection.then(c => {
				let req = new Request(c);
				req.query(SqlServerMetadataQueries.SYS_SCHEMAS).then(recordset => {
					schemaInfo.Schemas = [];
					schemaInfo.Tables = [];

					for (let i = 0; i < recordset.length; i++) {
						let record = recordset[i];
						let schema = new Schema({
							Name: record.name,
							Owner: record.owner
						});
						schemaInfo.Schemas.push(schema);
					}

					Promise.resolve(schemaInfo.Schemas)
						.then(schemas => {
							schemas.map(s => this.retrieveTables(c, s)
								.then(t => schemaInfo.Tables.push(...t)));
						}).then(() => resolve(schemaInfo));

				}, reason => console.error);
			}, reason => console.error);
		});

		return ret;
	}

	private retrieveTables(connection: Connection, schema: Schema): Promise<Table[]> {
		let ret = new Promise<Table[]>(resolve => {
			let req = new Request(connection);
			let sql = SqlServerMetadataQueries.SYS_TABLES.replace('{schema_name}', schema.Name);

			req.query(sql).then(recordset => {
				let tables: Table[] = [];
				for (let i = 0; i < recordset.length; i++) {
					let record = recordset[i];
					let table = new Table({
						Id: record.table_id,
						Name: record.table_name,
						Schema: schema,
						Columns: [],
						PrimaryKey: []
					});
					tables.push(table);
				}

				Promise.resolve(tables)
					.then(tbs => tbs.map(t => this.retrieveColumns(connection, t)
						.then(c => t.Columns.push(...c))
						.then(() => resolve(tables))));
			}, rejected => console.error);
		});

		return ret;
	}

	private retrieveColumns(connection: Connection, table: Table): Promise<Column[]> {
		let ret = new Promise<Column[]>(resolve => {
			let req = new Request(connection);
			let sql = SqlServerMetadataQueries.SYS_COLUMS.replace('{table_id}', table.Id.toString());
			req.query(sql).then(recordset => {
				let columns: Column[] = [];
				for (let i = 0; i < recordset.length; i++) {
					let record = recordset[i];
					let column = new Column({
						Name: record.column_name,
						DatabaseType: record.type_name,
						Size: record.max_length,
						Precision: record.precision
					});
					columns.push(column);
				}
				resolve(columns);
			}, rejected => console.error);
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