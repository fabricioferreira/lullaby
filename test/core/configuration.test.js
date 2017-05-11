var Configuration = require('../src/core/configuration').Configuration;
var path = require('path');
var currentPath = path.dirname(require.main.filename);

var assert = require('assert');

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
			})
		});
	});
});