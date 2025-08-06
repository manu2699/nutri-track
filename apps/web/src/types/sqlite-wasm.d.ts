// Toned version of node_modules/@sqlite.org/sqlite-wasm/index.d.ts
// Using this as sqlite3Worker1Promiser type is absent in the original type definition

declare module "@sqlite.org/sqlite-wasm" {
	// Worker1 API types
	export interface WorkerConfig {
		onready?: (promiser: SQLitePromiser) => void;
		onerror?: (error: Error) => void;
		worker?: string;
		generateMessageId?: () => string;
	}

	export interface SQLiteWorkerResponse {
		type: string;
		result: any;
		error?: string;
		dbId?: string;
	}

	export type SQLitePromiser = (type: string, options: any) => Promise<SQLiteWorkerResponse>;

	// Worker1 factory function
	export function sqlite3Worker1Promiser(config?: WorkerConfig): SQLitePromiser;
	export function sqlite3Worker1Promiser(onready: (promiser: SQLitePromiser) => void): SQLitePromiser;
	export function sqlite3Worker1Promiser(): SQLitePromiser;

	export namespace sqlite3Worker1Promiser {
		export const defaultConfig: WorkerConfig;
		export function v2(config?: WorkerConfig): Promise<SQLitePromiser>;
	}
}
