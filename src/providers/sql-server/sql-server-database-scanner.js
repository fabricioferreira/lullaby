"use strict";
exports.__esModule = true;
var SqlServerDatabaseScanner = (function () {
    function SqlServerDatabaseScanner(_connectionString) {
        this._connectionString = _connectionString;
        this._connected = false;
        this._sql = require('mssql');
    }
    SqlServerDatabaseScanner.prototype.getSchema = function () {
        if (!this._connected) {
            this.connect();
        }
        return null;
    };
    SqlServerDatabaseScanner.prototype.connect = function () {
    };
    return SqlServerDatabaseScanner;
}());
exports.SqlServerDatabaseScanner = SqlServerDatabaseScanner;
//# sourceMappingURL=sql-server-database-scanner.js.map