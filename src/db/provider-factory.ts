// TODO: Find a way to dinamically load providers based on the desired type

import { IProvider } from '../db/provider';
import { SchemaResolver } from './schema-resolver';
import { SqlServerProvider } from '../providers/sql-server/sql-server-provider';
import { ConnectionInfo } from '../db/connection-info';

export class ProviderFactory {
	public constructor() { }

	public createProvider(type: string, info: ConnectionInfo): Promise<IProvider> {
		var ret = new Promise<IProvider>(resolve => {
			switch (type) {
				case "sqlserver":
					resolve(new SqlServerProvider(info, new SchemaResolver()));
			}

			return null;
		});

		return ret;
	}
}