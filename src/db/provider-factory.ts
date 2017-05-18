// TODO: Find a way to dinamically load providers based on the desired type

import { IProvider } from './provider';
import { SqlServerProvider } from '../providers/sql-server/sql-server-provider';

export class ProviderFactory {
	public constructor() { }

	public createProvider(type: string): Promise<IProvider> {
		var ret = new Promise<IProvider>(resolve => {
			if (type === 'MSSQL') {
				// resolve(new SqlServerProvider())

				resolve(null);
			}
		});

		return ret;
	}
}