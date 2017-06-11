import { Table, Column, SchemaInfo } from './schema-info';
import * as _ from 'lodash';

export class SchemaResolver {
	public constructor() { }

	public resolve(tables: Table[], columns: Column[]): SchemaInfo {
		if (_.isNull(tables) || _.isNull(columns))
			return null;

		tables.forEach(t => {
			t.Columns = columns.filter(c => c.TableId === t.Id);
			t.PrimaryKey = columns.filter(c => c.TableId == t.Id && c.IsPrimaryKey);
		});

		let ret = new SchemaInfo();
		ret.Tables = tables;

		return ret;
	}
}