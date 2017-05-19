export class SqlServerMetadataQueries {
	public static SYS_TABLES: string =
	`select s.[name] [schema_name], t.[object_id] [table_id], t.[name] [table_name]
	 from sys.schemas s
	 	join sys.tables t on s.[schema_id] = t.[schema_id]
	 where t.[type] = 'U'
	 order by t.[object_id]`;

	public static SYS_COLUMS: string =
	`select c.[object_id] table_id, c.column_id, c.name column_name, type_name(c.system_type_id) [type_name],
			c.max_length, c.precision, c.is_nullable, IIF(ix.column_id IS NULL, 0, 1) is_pk
	 from sys.columns c
		left join sys.tables t
			on c.[object_id] = t.[object_id]
		left join (select i.[object_id], ic.column_id
					from sys.indexes i
						join sys.index_columns ic
							on i.[object_id] = ic.[object_id]
							and i.index_id = ic.index_id
					where i.is_primary_key = 1) ix
			on c.[object_id] = ix.[object_id]
			and c.column_id = ix.column_id
	 where t.[type] = 'U'
	 order by c.[object_id], c.[column_id]`;
}