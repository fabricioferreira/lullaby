import { ParameterDictionary } from '../../db/parameter-dictionary';

export class SqlServerQueryBuilder {
	private SELECT: string = 'SELECT * FROM ||SCHEMA_NAME||.||TABLE_NAME|| WHERE ||PRIMARY_KEY|| = ||PRIMARY_KEY_VALUE||';

	public createQuery(schema: string, table: string, column: string, value: any): string {
		let result = this.SELECT
			.replace('||SCHEMA_NAME||', schema)
			.replace('||TABLE_NAME||', table)
			.replace('||PRIMARY_KEY||', column)
			.replace('||PRIMARY_KEY_VALUE||', value);

		return result;
	}
}