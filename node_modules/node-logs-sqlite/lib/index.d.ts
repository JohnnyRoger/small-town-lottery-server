/// <reference types="node" />
/// <reference types="sqlite3" />

declare module "node-logs-sqlite" {

	import { Database } from "sqlite3";
	import Logs = require("node-logs");

	interface iLogDate {
		year: string;
		month: string;
		day: string;
	}

	interface iLog {
		date: string;
		time: string;
		type: string;
		message: string;
	}

	class SQLiteLogs extends Logs {

		protected _deleteLogsAfterXDays: number;
		protected _localStorageDatabase: string;
		protected _localStorageObject: null|Database;

		constructor();

		public deleteLogsAfterXDays(days: number): Logs;
		public localStorageDatabase(database: string): Logs;

		public init(): Promise<void>;
		public getLogs(): Promise<Array<iLogDate>>;
		public readLog(year: string|number, month: string|number, day: string|number): Promise<Array<iLog>>;

	}

	export = Logs;

}
