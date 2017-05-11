export class SqlServerConnectionInfo {
	Database: string;
	Server: string;
	UserName: string;
	Password: string;
	ConnectionTimeout: number;
	RequestTimeout: number;
	UseIntegratedAuthentication: boolean;

	constructor(info: SqlServerConnectionInfo) {
		Object.assign(this, info);
	}
}