export class SqlServerConnectionInfo {
	Database: string;
	Server: string;
	UserName: string;
	Password: string;
	UseIntegratedAuthentication: boolean;

	constructor(info: SqlServerConnectionInfo) {
		Object.assign(this, info);
	}
}