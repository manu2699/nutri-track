import type { NutriTrackDB } from ".";

export const trackingTableSchema = `CREATE TABLE IF NOT EXISTS trackings (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
time DATETIME DEFAULT CURRENT_TIMESTAMP,
calories REAL DEFAULT 0,
protein REAL DEFAULT 0,
carbohydrates REAL DEFAULT 0,
fat REAL DEFAULT 0,
fiber REAL DEFAULT 0,
sodium REAL DEFAULT 0,
sugar REAL DEFAULT 0,
vitamin_c REAL DEFAULT 0,
vitamin_d REAL DEFAULT 0,
calcium REAL DEFAULT 0,
iron REAL DEFAULT 0,
water_intake REAL DEFAULT 0,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users (id),
UNIQUE(user_id, time)
)`;

export interface TrackingDataInterface {
	id: number;
	user_id: number;
	time: string;
	calories: number;
	protein: number;
	carbohydrates: number;
	fat?: number;
	fiber?: number;
	sodium?: number;
	sugar?: number;
	vitamin_c?: number;
	vitamin_d?: number;
	calcium?: number;
	iron?: number;
	water_intake?: number;
	created_at: string;
}

export class TrackingController {
	db: NutriTrackDB;
	constructor(db: NutriTrackDB) {
		this.db = db;
	}
	async addTracking(userId: number, nutritionData: TrackingDataInterface) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const fields = ["user_id"];
		const placeholders = ["?"];
		const values = [userId];

		Object.entries(nutritionData).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				fields.push(key);
				placeholders.push("?");
				values.push(value);
			}
		});

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: `INSERT OR REPLACE INTO trackings (${fields.join(", ")}) 
                VALUES (${placeholders.join(", ")})`,
			bind: values
		});
	}

	async updateTracking(userId: number, nutritionData: TrackingDataInterface) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const updates: string[] = [];
		const values = [];

		Object.entries(nutritionData).forEach(([key, value]) => {
			if (value !== undefined) {
				updates.push(`${key} = ?`);
				values.push(value);
			}
		});

		if (updates.length === 0) return false;

		values.push(userId);

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: `UPDATE trackings SET ${updates.join(", ")} 
                WHERE user_id = ? AND time = ?`,
			bind: values
		});

		return true;
	}

	async getTracking(userId: number, time: string) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const result = await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "SELECT * FROM trackings WHERE user_id = ? AND time LIKE ?",
			bind: [userId, `${time}%`],
			returnValue: "resultRows"
		});

		return result.result.length > 0 ? (result.result[0] as TrackingDataInterface) : null;
	}

	async getTrackingHistory(userId: number, limit = 30) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const result = await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: `SELECT * FROM trackings 
                WHERE user_id = ? 
                ORDER BY time DESC 
                LIMIT ?`,
			bind: [userId, limit],
			returnValue: "resultRows"
		});

		return result.result as TrackingDataInterface[];
	}
}
