import { Request as expRequest, Response, NextFunction, IRoute } from '@types/express';
import { SqlServerProvider } from './sql-server-provider';
import { SchemaResolver } from '../../db/schema-resolver';
import { ConnectionInfo } from '../../db/connection-info';

export class SqlServerHandler {
	public static Resolver: SchemaResolver;
	public static ConnectionInfo: ConnectionInfo;

	public static getHandler(req: expRequest, res: Response, next: NextFunction): void {
		let provider: SqlServerProvider = new SqlServerProvider(SqlServerHandler.ConnectionInfo, SqlServerHandler.Resolver);
		provider.createResultObject(req.baseUrl, req.params)
			.then(result => {
				res.write(result);
				res.end();
			})
			.catch(next);
	}
}