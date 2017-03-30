const SqlServerConnectionInfo = require('../src/providers/sql-server/sql-server-connectoin-info').SqlServerConnectionInfo;
const SqlServerDatabaseScanner = require('../src/providers/sql-server/sql-server-database-scanner').SqlServerDatabaseScanner;
const path = require('path');
const currentPath = path.dirname(require.main.filename);

const assert = require('assert');
const expect = require('chai').expect;

describe('SqlServerDatabaseScanner', () => {
	describe('getSchema()', () => {
		let ci = new SqlServerConnectionInfo({
			Database: 'WideWorldImporters',
			Server: 'localhost\\SQLEXPRESS',
			UserName: 'rest_user',
			Password: 'user'
		});

		let cm = new SqlServerDatabaseScanner(ci);

		it('should bring at least one schema', () => {
			let schema = cm.getSchema();

			return schema.then(s => {
				expect(s.Schemas.length).to.be.at.least(1);
			});
		});
		it('should bring the "Application" schema', () => {
			let schema = cm.getSchema();

			return schema.then(s => {
				expect(s.Schemas.filter(s => s.Name === 'Application').length).to.be.eql(1);
			})
		});
		it('should bring at least one table', () => {
			let schema = cm.getSchema();

			return schema.then(s => {
				expect(s.Tables.length).to.be.at.least(1);
			});
		});
		it('should bring the "Warehouse.Colors" table', () => {
			let schema = cm.getSchema();

			return schema.then(s => {
				s.Schemas.forEach(function (c) {
					console.log(c.Name);
				});

				s.Tables.forEach(function (t) {
					console.log(t.Schema.Name, ".", t.Name);
				});

				let table = s.Tables
					.filter(t => t.Name === 'Colors'
						&& t.Schema.Name === 'Warehouse');
				expect(table.length).to.be.eql(1);
			});
		});
	});
});