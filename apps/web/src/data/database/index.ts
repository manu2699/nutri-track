/** biome-ignore-all lint/suspicious/noExplicitAny: -- */
import { sqlite3Worker1Promiser } from "@sqlite.org/sqlite-wasm";

import { trackingTableSchema } from "./trackings";
import { userTableSchema } from "./users";

export class NutriTrackDB {
	promiser: SQLitePromiser | null;
	dbId: string | null;
	isInitialized: boolean;

	constructor() {
		this.promiser = null;
		this.dbId = null;
		this.isInitialized = false;
	}

	async initialize() {
		try {
			console.log("NTDB:: Initializing SQLite3 module...");

			this.promiser = await new Promise((resolve) => {
				const _promiser = sqlite3Worker1Promiser({
					onready: () => resolve(_promiser)
				});
			});

			if (!this.promiser) {
				throw new Error("Failed to initialize SQLite3 module");
			}

			const openResponse = await this.promiser("open", {
				filename: "file:nutritrack_v1.sqlite3?vfs=opfs"
			});

			if (!openResponse.dbId) {
				throw new Error("Failed to open database");
			}

			this.dbId = openResponse.dbId;
			console.log("NTDB:: Database opened successfully");

			await this.createTables();
			this.isInitialized = true;

			return true;
		} catch (error) {
			console.error("NTDB:: Database initialization failed:", error);
			throw error;
		}
	}

	async createTables() {
		if (!this.promiser || !this.dbId) {
			throw new Error("Database not initialized");
		}

		for (const sql of [userTableSchema, trackingTableSchema]) {
			await this.promiser("exec", {
				dbId: this.dbId,
				sql: sql
			});
		}
	}
}

// SQLite WASM specific types
export interface SQLiteWorkerResponse {
	error?: string;
	dbId?: string;
	result?: any;
}

export type SQLitePromiser = (type: string, options: any) => Promise<SQLiteWorkerResponse>;

export { TrackingController } from "./trackings";
export { UserController } from "./users";
