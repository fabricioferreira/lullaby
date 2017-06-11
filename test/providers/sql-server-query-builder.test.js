const SqlServerQueryBuilder = require('../../src/providers/sql-server/sql-server-query-builder').SqlServerQueryBuilder;

const assert = require('assert');
const expect = require('chai').expect;

describe('SqlServerQueryBuilder', () => {
	describe('createQuery()', () => {
		it('should bring a SELECT for Cars table', () => {
			let table = 'Cars';
			let column = 'CarId';
			let value = 1;

			let builder = new SqlServerQueryBuilder();
			let actual = builder.createQuery(table, column, value);
			let expected = 'SELECT * FROM Cars WHERE CarId = 1';

			expect(actual).to.be.eql(expected);
		});
		it('should bring a SELECT for Vehicles table', () => {
			let table = 'Vehicles';
			let column = 'VehicleId';
			let value = 10;

			let builder = new SqlServerQueryBuilder();
			let actual = builder.createQuery(table, column, value);
			let expected = 'SELECT * FROM Vehicles WHERE VehicleId = 10';

			expect(actual).to.be.eql(expected);
		});
	});
});