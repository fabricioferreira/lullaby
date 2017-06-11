const ConnectionInfo = require('../../src/db/connection-info').ConnectionInfo;
const SqlServerProvider = require('../../src/providers/sql-server/sql-server-provider').SqlServerProvider;
const SchemaResolver = require('../../src/db/schema-resolver').SchemaResolver;

const path = require('path');
const currentPath = path.dirname(require.main.filename);

const assert = require('assert');
const expect = require('chai').expect;

describe('SqlServerProvider', () => {
	let ci = new ConnectionInfo({
		Database: 'WideWorldImporters',
		Server: 'localhost\\SQLEXPRESS',
		UserName: 'rest_user',
		Password: 'user',
		ConnectionTimeout: 5000,
		RequestTimeout: 5000
	});

	let resolver = new SchemaResolver();
	let provider = new SqlServerProvider(ci, resolver);

	describe('getSchema()', () => {
		it('should bring at least one table', () => {
			let schema = provider.getSchemaInfo();

			return schema.then(s => {
				expect(s.Tables.length).to.be.at.least(1);
			}).catch(reason => console.log(reason));
		});
		it('should bring the "Warehouse.Colors" table', () => {
			let schema = provider.getSchemaInfo();

			return schema.then(s => {
				let table = s.Tables.filter(t => t.Name === 'Colors' && t.Schema === 'Warehouse');
				expect(table.length).to.be.eql(1);
			});
		});
	});
	describe('getTableFromUrl', () => {
		it('should return \'Cars\' as table name', () => {
			let url = '/cars/1';
			let expected = 'cars';
			let actual = provider.getTableFromUrl(url);

			expect(actual).to.be.eql(expected);
		});
		it('should return \'Vehicles\' as table name', () => {
			let url = '/vehicles/1';
			let expected = 'vehicles';
			let actual = provider.getTableFromUrl(url);

			expect(actual).to.be.eql(expected);
		});
	});
	describe('getParametersFromUrl', () => {
		it('should return a list with one parameter and value', () => {
			let url = '/cars/1';
			let expected = 'cars';
			let actual = provider.getTableFromUrl(url);

			expect(actual).to.be.eql(expected);
		});
	});
});