const SchemaResolver = require('../../src/db/schema-resolver').SchemaResolver;
const Table = require('../../src/db/schema-info').Table;
const Column = require('../../src/db/schema-info').Column;

const path = require('path');
const currentPath = path.dirname(require.main.filename);

const assert = require('assert');
const expect = require('chai').expect;

describe('SchemaResolver', () => {
	describe('resolve()', () => {
		it('should return null when no tables and columns are passed in', function () {
			let resolver = new SchemaResolver();

			let schema = resolver.resolve(null, null);

			expect(schema).to.be.null;
		});
		it('should return null when no tables, but columns are passed in', function () {
			let resolver = new SchemaResolver();
			let columns = [new Column({ TableId: 1234, Name: 'abc' })];

			let schema = resolver.resolve(null, columns);

			expect(schema).to.be.null;
		});
		it('should return a schema with one table, and two columns', function () {
			let resolver = new SchemaResolver();
			let tables = [];
			let columns = [];

			tables.push(
				new Table({
					Id: 1234,
					Name: 'Table1',
					Schema: 'dbo',
					Columns: null,
					PrimaryKey: null
				}));

			columns.push(
				new Column({
					TableId: 1234,
					Name: 'Column1',
					DatabaseType: 'integer',
					Precision: 0,
					Size: 4
				}),
				new Column({
					TableId: 1234,
					Name: 'Column2',
					DatabaseType: 'varchar',
					Precision: 0,
					Size: 20
				})
			);

			let schema = resolver.resolve(tables, columns);

			expect(schema.Tables.length).to.be.eql(1);
			expect(schema.Tables[0].Columns.length).to.be.eql(2);
		});
		it('should return a schema with two tables, two columns each', function () {
			let resolver = new SchemaResolver();
			let tables = [];
			let columns = [];

			tables.push(
				new Table({
					Id: 1,
					Name: 'Table1',
					Schema: 'dbo',
					Columns: null,
					PrimaryKey: null
				}),
				new Table({
					Id: 2,
					Name: 'Table2',
					Schema: 'dbo',
					Columns: null,
					PrimaryKey: null
				})
			);

			columns.push(
				new Column({
					TableId: 1,
					Name: 'Column1',
					DatabaseType: 'integer',
					Precision: 0,
					Size: 4
				}),
				new Column({
					TableId: 1,
					Name: 'Column2',
					DatabaseType: 'varchar',
					Precision: 0,
					Size: 20
				}),
				new Column({
					TableId: 2,
					Name: 'Column1',
					DatabaseType: 'integer',
					Precision: 0,
					Size: 4
				}),
				new Column({
					TableId: 2,
					Name: 'Column2',
					DatabaseType: 'varchar',
					Precision: 0,
					Size: 20
				})
			);

			let schema = resolver.resolve(tables, columns);

			expect(schema.Tables.length).to.be.eql(2);
			expect(schema.Tables[0].Columns.length).to.be.eql(2);
			expect(schema.Tables[1].Columns.length).to.be.eql(2);
		});
	})
});