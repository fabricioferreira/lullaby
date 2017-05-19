var Configuration = require('../../src/core/configuration').Configuration;
var path = require('path');
var currentPath = path.dirname(require.main.filename);

var assert = require('chai').assert;

/*
{
	"ServerPort": 3000,
	"ApiPath": "/rest",
	"ProviderType": "sqlserver",
	"ConnectionInfo": {
		"Server": "localhost",
		"Database": "db",
		"UserName": "rest_user",
		"Password": "user",
		"ConnectionTimeout": "5000",
		"RequestTimeout": "5000"
	}
}
*/

describe('Configuration', () => {
	describe('load()', () => {
		it('should not fail if no configuration file is provided', () => {
			let config = new Configuration('');
			return config.load();
		});
		it('should load configuration if a valid file is provided', () => {
			let config = new Configuration(path.resolve(__dirname, 'test-config.json'));

			return config.load().then(() => {
				assert.equal(config.ServerPort, 3000, 'Port configuration was not loaded.');
				assert.equal(config.ApiPath, '/rest', 'ApiPath was not loaded.');
				assert.equal(config.ProviderType, 'sqlserver', 'ProviderType was not loaded.');
				assert.isNotNull(config.ConnectionInfo, 'ConnectionInfo was not loaded.');
				assert.equal(config.ConnectionInfo.Server, 'localhost', 'Server was not loaded.');
				assert.equal(config.ConnectionInfo.Database, 'db', 'Database was not loaded.');
				assert.equal(config.ConnectionInfo.UserName, 'rest_user', 'UserName was not loaded.');
				assert.equal(config.ConnectionInfo.Password, 'user', 'Password was not loaded.');
				assert.equal(config.ConnectionInfo.ConnectionTimeout, '5000', 'ConnectionTimeout was not loaded.');
				assert.equal(config.ConnectionInfo.RequestTimeout, '5000', 'RequestTimeout was not loaded.');
			})
		});
	});
});