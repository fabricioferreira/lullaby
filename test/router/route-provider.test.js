const RouteProvider = require('../../src/core/route-provider').RouteProvider;
const SchemaInfo = require('../../src/db/schema-info').SchemaInfo;
const Table = require('../../src/db/schema-info').Table;
const Column = require('../../src/db/schema-info').Column;

const assert = require('chai').assert;
const expect = require('chai').expect;

describe('RouteProvider', () => {
	describe('createRoutes()', () => {
		let si = new SchemaInfo();
		si.DatabaseName = "DatabaseTestName";
		si.Tables = [];

		let table = new Table({
			Schema: 'dbo',
			Id: 1,
			Name: 'TableName1',
			Columns: [],
			PrimaryKey: []
		});

		table.Columns.push(new Column({
			TableId: 1,
			Name: 'ColumnName1',
			DatabaseType: 'varchar',
			Size: 20,
			Precision: 0,
			IsPrimaryKey: true
		}));
		table.PrimaryKey.push(table.Columns[0]);

		si.Tables.push(table);
		it('create a single route', () => {
			let routes = [];
			let provider = new RouteProvider();
			let actual = provider.createRoutes(si, (route) => routes.push(route));

			expect(routes.length).to.be.eql(1);

			let theOneRoute = routes.pop();
			expect(theOneRoute).to.be.eql('/tablename1/:columnname1');
		});
	});
});