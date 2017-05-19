const ConnectionInfo = require('../../src/db/connection-info').ConnectionInfo;
const SqlServerProvider = require('../../src/providers/sql-server/sql-server-provider').SqlServerProvider;
const SchemaResolver = require('../../src/db/schema-resolver').SchemaResolver;

const path = require('path');
const currentPath = path.dirname(require.main.filename);

const assert = require('assert');
const expect = require('chai').expect;

describe('SqlServerProvider', () => {
	describe('getSchema()', () => {
		let ci = new ConnectionInfo({
			Database: 'WideWorldImporters',
			Server: 'localhost\\SQLEXPRESS',
			UserName: 'rest_user',
			Password: 'user',
			ConnectionTimeout: 5000,
			RequestTimeout: 5000
		});

		let resolver = new SchemaResolver();
		let cm = new SqlServerProvider(ci, resolver);

		it('should bring at least one table', () => {
			let schema = cm.getSchemaInfo();

			return schema.then(s => {
				expect(s.Tables.length).to.be.at.least(1);
			}).catch(reason => console.log(reason));
		});
		it('should bring the "Warehouse.Colors" table', () => {
			let schema = cm.getSchemaInfo();

			return schema.then(s => {
				let table = s.Tables.filter(t => t.Name === 'Colors' && t.Schema === 'Warehouse');
				expect(table.length).to.be.eql(1);
			});
		});
	});
});