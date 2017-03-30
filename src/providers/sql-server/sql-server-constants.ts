export class SqlServerMetadataQueries {
	public static SYS_SCHEMAS: string =
	`select distinct s.[name], p.[name] [owner]
	 from sys.schemas s
		join sys.tables t on s.[schema_id] = t.[schema_id]
		join sys.database_principals p on s.[principal_id] = p.[principal_id]
	 where t.[type] = 'U'`;

	public static SYS_TABLES: string =
	`select s.[name] [schema_name], t.[object_id] [table_id], t.[name] [table_name]
	 from sys.schemas s
	 	join sys.tables t on s.[schema_id] = t.[schema_id]
	 where t.[type] = 'U'
	   and s.[name] = '{schema_name}'`;

	public static SYS_COLUMS: string =
	`select column_id, c.name column_name, type_name(c.system_type_id) [type_name], c.max_length, c.precision, c.is_nullable
	 from sys.columns c
	 where c.object_id = {table_id}`;
}