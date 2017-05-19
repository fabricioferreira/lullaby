export class ConnectionInfo {
	Server: string;
	Database: string;
	UserName: string;
	Password: string;
	ConnectionTimeout: number;
	RequestTimeout: number;
	constructor(info: ConnectionInfo) {
		Object.assign(this, info);
	}
}