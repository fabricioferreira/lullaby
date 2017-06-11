import { IProvider } from '../../db/provider';
import { SchemaResolver } from '../../db/schema-resolver';
import { SchemaInfo, Table, Column } from '../../db/schema-info';
import { ConnectionInfo } from '../../db/connection-info';
import { SqlServerMetadataQueries } from '../../providers/sql-server/sql-server-constants';
import { SqlServerQueryBuilder } from './sql-server-query-builder';
import { SqlServerHandler } from './sql-server-handler';
import { ConnectionPool, Request, config } from 'mssql';
import { Request as expRequest, Response, NextFunction, IRoute } from '@types/express';
import * as _ from 'lodash';

export class SqlServerProvider implements IProvider {
	private _builder: SqlServerQueryBuilder = new SqlServerQueryBuilder();
	private _schemaInfo: SchemaInfo = null;
	public _handler: SqlServerHandler = SqlServerHandler;

	public constructor(private connectionInfo: ConnectionInfo, private schemaResolver: SchemaResolver) {
		SqlServerHandler.Resolver = schemaResolver;
		SqlServerHandler.ConnectionInfo = connectionInfo;
	}

	public handler(): any {
		return this._handler;
	}

	public async getSchemaInfo(): Promise<SchemaInfo> {
		try {
			if (this._schemaInfo !== null) return this._schemaInfo;

			let connection = await this.createConnection();
			let tables = await this.retrieveAllTables(connection);
			let columns = await this.retrieveAllColumns(connection);
			let self = this;

			let ret = new Promise<SchemaInfo>(resolve => {
				let schemaInfo = self.schemaResolver.resolve(tables, columns);

				resolve(schemaInfo);
			});

			return ret;
		}
		catch (err) {
			throw `Error initializing the SqlServerProvider.\nError: ${err}`;
		}
	}

	public setSchemaInfo(info: SchemaInfo): void {
		this._schemaInfo = info;
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
					Schema: record.schema_name,
					AssociatedRoute: null
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
					Precision: record.precision,
					IsPrimaryKey: record.is_pk
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

	private async runQuery(connection: ConnectionPool, sql: string): Promise<any> {
		let req = new Request(connection);
		let result = await req.query(sql);
		let recordset = result.recordset;

		return recordset;
	}

	public getTableFromUrl(url: string): string {
		if (_.isNil(url))
			return null;

		let length: number = url.indexOf('/', 1) - 1;
		let table: string = url.substr(1, length);

		return table;
	}

	public async createResultObject(baseUrl: any, parameters: any): Promise<string> {
		let table = this.getTableFromUrl(baseUrl);
		let schemaInfo = await this.getSchemaInfo();
		console.log(table);
		let schemaTable = schemaInfo.Tables.find(t => t.Name.toLowerCase() === table);
		let primaryKey = schemaTable.PrimaryKey[0];
		let parameter = parameters[primaryKey.Name.toLowerCase()];
		let sql = this._builder.createQuery(schemaTable.Schema, table, primaryKey.Name.toLowerCase(), parameter);

		let connection = await this.createConnection();
		let result: any = await this.runQuery(connection, sql);

		return new Promise<string>(resolve => {
			let json = JSON.stringify(result);
			// let json = JSON.stringify({ url: baseUrl, params: parameters, p: parameter });
			resolve(json);
		});
	}
}