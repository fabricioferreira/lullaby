import { IProvider } from 'db/provider';
import { SchemaResolver } from 'db/schema-resolver';
import { SchemaInfo, Table, Column } from 'db/schema-information';
import { SqlServerConnectionInfo } from 'providers/sql-server/sql-server-connectoin-info';
import { SqlServerMetadataQueries } from 'providers/sql-server/sql-server-constants';
import { ConnectionPool, Request, config } from 'mssql';
import * as _ from 'lodash';

export class SqlServerProvider implements IProvider {

	public constructor(private connectionInfo: SqlServerConnectionInfo,
		private schemaResolver: SchemaResolver) { }

	public async getSchemaInfo(): Promise<SchemaInfo> {
		let connection = await this.createConnection();
		let tables = await this.retrieveAllTables(connection);
		let columns = await this.retrieveAllColumns(connection);

		let ret = new Promise<SchemaInfo>(resolve => {
			let schemaInfo = this.schemaResolver.resolve(tables, columns);
			resolve(schemaInfo);
		});

		return ret;
	}

	private async retrieveAllTables(connection: ConnectionPool): Promise<Table[]> {
		let req = new Request(connection);
		let sql = SqlServerMetadataQueries.SYS_TABLES;
		let result = await req.query(sql);
		let recordset = result.recordset;

		let ret = new Promise<Table[]>(resolve => {
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
		});

		return ret;
	}

	private async retrieveAllColumns(connection: ConnectionPool): Promise<Column[]> {
		let req = new Request(connection);
		let sql = SqlServerMetadataQueries.SYS_COLUMS;
		let result = await req.query(sql);
		let recordset = result.recordset;

		let ret = new Promise<Column[]>(resolve => {
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
		});

		return ret;
	}

	private async createConnection(): Promise<ConnectionPool> {
		let c = this.createConnectionConfig();
		let connection = new ConnectionPool(c);

		return connection.connect();
	}

	private createConnectionConfig(): config {
		let cf: config = {
			server: this.connectionInfo.Server,
			user: this.connectionInfo.UserName,
			password: this.connectionInfo.Password,
			database: this.connectionInfo.Database,
			connectionTimeout: this.connectionInfo.ConnectionTimeout,
			requestTimeout: this.connectionInfo.RequestTimeout
		};

		return cf;
	}
}