export class SqlServerMetadataQueries {
	public static SYS_TABLES: string =
	`select s.[name] [schema_name], t.[object_id] [table_id], t.[name] [table_name]
	 from sys.schemas s
	 	join sys.tables t on s.[schema_id] = t.[schema_id]
	 where t.[type] = 'U'
	 order by t.[object_id]`;

	public static SYS_COLUMS: string =
	`select c.[object_id] table_id, column_id, c.name column_name, type_name(c.system_type_id) [type_name],
			c.max_length, c.precision, c.is_nullable
	 from sys.columns c
	 order by c.[object_id], [column_id]`;
}