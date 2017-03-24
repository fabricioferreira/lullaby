"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var Configuration = (function () {
    function Configuration() {
    }
    return Configuration;
}());
exports.Configuration = Configuration;
var ConfigurationManager = (function () {
    function ConfigurationManager(_configFilePath) {
        var _this = this;
        this._configFilePath = _configFilePath;
        this._loaded = false;
        this.load(function () { return _this._loaded = true; });
    }
    ConfigurationManager.prototype.get = function () {
        return this._configuration;
    };
    ConfigurationManager.prototype.load = function (ready) {
        var _this = this;
        this._configuration = null;
        fs_1.exists(this._configFilePath, function (exists) {
            if (exists) {
                var configContent = fs_1.readFileSync(_this._configFilePath);
                _this._configuration = JSON.parse(configContent.toString());
                if (ready)
                    ready();
            }
        });
    };
    return ConfigurationManager;
}());
exports.ConfigurationManager = ConfigurationManager;
//# sourceMappingURL=configuration-manager.js.map