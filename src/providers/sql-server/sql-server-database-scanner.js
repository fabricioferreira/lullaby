"use strict";
exports.__esModule = true;
var schema_information_1 = require("../../db/schema-information");
var sql_server_constants_1 = require("./sql-server-constants");
var mssql_1 = require("mssql");
var SqlServerDatabaseScanner = (function () {
    function SqlServerDatabaseScanner(connectionInfo) {
        this.connectionInfo = connectionInfo;
    }
    SqlServerDatabaseScanner.prototype.getSchema = function () {
        var _this = this;
        var connection = this.createConnection();
        var ret = new Promise(function (resolve) {
            var schemaInfo = new schema_information_1.SchemaInformation();
            connection.then(function (c) {
                var req = new mssql_1.Request(c);
                req.query(sql_server_constants_1.SqlServerMetadataQueries.SYS_SCHEMAS).then(function (recordset) {
                    schemaInfo.Schemas = [];
                    schemaInfo.Tables = [];
                    for (var i = 0; i < recordset.length; i++) {
                        var record = recordset[i];
                        var schema = new schema_information_1.Schema({
                            Name: record.name,
                            Owner: record.owner
                        });
                        schemaInfo.Schemas.push(schema);
                    }
                    Promise.resolve(schemaInfo.Schemas)
                        .then(function (schemas) {
                        schemas.map(function (s) { return _this.retrieveTables(c, s)
                            .then(function (t) {
                            return (_a = schemaInfo.Tables).push.apply(_a, t);
                            var _a;
                        }); });
                    }).then(function () { return resolve(schemaInfo); });
                }, function (reason) { return console.error; });
            }, function (reason) { return console.error; });
        });
        return ret;
    };
    SqlServerDatabaseScanner.prototype.retrieveTables = function (connection, schema) {
        var _this = this;
        var ret = new Promise(function (resolve) {
            var req = new mssql_1.Request(connection);
            var sql = sql_server_constants_1.SqlServerMetadataQueries.SYS_TABLES.replace('{schema_name}', schema.Name);
            req.query(sql).then(function (recordset) {
                var tables = [];
                for (var i = 0; i < recordset.length; i++) {
                    var record = recordset[i];
                    var table = new schema_information_1.Table({
                        Id: record.table_id,
                        Name: record.table_name,
                        Schema: schema,
                        Columns: [],
                        PrimaryKey: []
                    });
                    tables.push(table);
                }
                Promise.resolve(tables)
                    .then(function (tbs) { return tbs.map(function (t) { return _this.retrieveColumns(connection, t)
                    .then(function (c) {
                    return (_a = t.Columns).push.apply(_a, c);
                    var _a;
                })
                    .then(function () { return resolve(tables); }); }); });
            }, function (rejected) { return console.error; });
        });
        return ret;
    };
    SqlServerDatabaseScanner.prototype.retrieveColumns = function (connection, table) {
        var ret = new Promise(function (resolve) {
            var req = new mssql_1.Request(connection);
            var sql = sql_server_constants_1.SqlServerMetadataQueries.SYS_COLUMS.replace('{table_id}', table.Id.toString());
            req.query(sql).then(function (recordset) {
                var columns = [];
                for (var i = 0; i < recordset.length; i++) {
                    var record = recordset[i];
                    var column = new schema_information_1.Column({
                        Name: record.column_name,
                        DatabaseType: record.type_name,
                        Size: record.max_length,
                        Precision: record.precision
                    });
                    columns.push(column);
                }
                resolve(columns);
            }, function (rejected) { return console.error; });
        });
        return ret;
    };
    SqlServerDatabaseScanner.prototype.createConnection = function () {
        var c = this.createConnectionConfig();
        var connection = new mssql_1.Connection(c);
        return connection.connect();
    };
    SqlServerDatabaseScanner.prototype.createConnectionConfig = function () {
        var cf = {
            server: this.connectionInfo.Server,
            user: this.connectionInfo.UserName,
            password: this.connectionInfo.Password,
            database: this.connectionInfo.Database
        };
        return cf;
    };
    return SqlServerDatabaseScanner;
}());
exports.SqlServerDatabaseScanner = SqlServerDatabaseScanner;
//# sourceMappingURL=sql-server-database-scanner.js.map