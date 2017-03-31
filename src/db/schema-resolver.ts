import { Table, Column, SchemaInfo } from './schema-information';
import * as _ from 'lodash';

export class SchemaResolver {
	public constructor() { }

	public resolve(tables: Table[], columns: Column[]): SchemaInfo {
		if (_.isNull(tables) || _.isNull(columns))
			return null;

		tables.forEach(t => {
			t.Columns = columns.filter(c => c.TableId === t.Id);
		});

		let ret = new SchemaInfo();
		ret.Tables = tables;

		return ret;
	}
}