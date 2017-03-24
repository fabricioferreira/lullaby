var ConfigurationManager = require('../src/core/configuration-manager').ConfigurationManager;
var path = require('path');
var currentPath = path.dirname(require.main.filename);

var assert = require('assert');

describe('ConfigurationManager', () => {
	describe('load()', () => {
		it('should not fail if no configuration file is provided', () => {
			let cm = new ConfigurationManager('');
			cm.load();
		});
		it('should load configuration if a valid file is provided', () => {
			let cm = new ConfigurationManager(path.resolve(__dirname, 'test-config.json'));
			let config = cm.get(() => {
				// assert.notEqual(cm.get(), null, 'Configuration was not loaded.');
				assert.equal(config.ServerPort, 3000, 'Port configuration was not loaded.');
				assert.equal(config.ApiPath, '', 'ApiPath was not loaded.');
			});
		});
	});
});