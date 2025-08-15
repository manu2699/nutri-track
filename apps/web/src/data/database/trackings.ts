import type { FoodItem, MealType } from "@nutri-track/core";

import type { NutriTrackDB } from ".";

export const trackingTableSchema = `CREATE TABLE IF NOT EXISTS trackings (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
time DATETIME DEFAULT CURRENT_TIMESTAMP,
calories REAL DEFAULT 0,
scale TEXT DEFAULT 'gm',
protein REAL DEFAULT 0,
carbohydrates REAL DEFAULT 0,
fat REAL DEFAULT 0,
fiber REAL DEFAULT 0,
sugar REAL DEFAULT 0,
food_id TEXT DEFAULT NULL,
water_intake REAL DEFAULT 0,
meal_type TEXT DEFAULT 'breakfast',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users (id),
UNIQUE(user_id, time)
)`;

export interface TrackingDataInterface {
	id: number;
	user_id: number;
	food_id: string;
	time: string;
	calories: number;
	scale: string;
	protein: number;
	carbohydrates: number;
	fat?: number;
	fiber?: number;
	sugar?: number;
	water_intake?: number;
	created_at: string;
	meal_type: string;
}

export class TrackingController {
	db: NutriTrackDB;
	constructor(db: NutriTrackDB) {
		this.db = db;
	}
	async addTracking(userId: number, foodItem: FoodItem, mealType: MealType) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const fields = ["user_id", "food_id"];
		const values: (number | string)[] = [userId, foodItem.id];

		const serializedData = serializeFoodToTracking(foodItem, mealType);
		Object.entries(serializedData).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				fields.push(key);
				values.push(value as number | string);
			}
		});

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: `INSERT OR REPLACE INTO trackings (${fields.join(", ")})
                VALUES (${Array(fields.length).fill("?").join(", ")})`,
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

	async getTracking(userId: number, time?: string) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const { result } = await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "SELECT * FROM trackings WHERE user_id = ?",
			bind: [userId],
			// sql: "SELECT * FROM trackings WHERE user_id = ? AND time LIKE ?",
			// bind: [userId, `${time}%`],
			returnValue: "resultRows",
			rowMode: "object"
		});

		console.log("NTDB :: get trackings ", result);

		return result.resultRows.length > 0 ? (result.resultRows as TrackingDataInterface[]) : null;
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

	async deleteTracking(userId: number, time: string) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "DELETE FROM trackings WHERE user_id = ? AND time LIKE ?",
			bind: [userId, `${time}%`]
		});
	}

	async deleteAllTrackings() {
		if (!import.meta.env.DEV) {
			return;
		}

		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "DELETE FROM trackings"
		});
	}

	async dropTable() {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "DROP TABLE trackings"
		});
	}
}

// TrackingSerializer extends TrackingDataInterface and omits user id
interface TrackingSerializer extends Omit<TrackingDataInterface, "user_id" | "time" | "id" | "created_at"> {}

export function serializeFoodToTracking(food: FoodItem, mealType: MealType): TrackingSerializer {
	return {
		calories: food.calories,
		scale: food.calorieMeasurement,
		protein: food.nutrients?.proteins ?? 0,
		carbohydrates: food.nutrients?.carbs ?? 0,
		fat: food.nutrients?.totalFats ?? 0,
		fiber: food.nutrients?.fiber ?? 0,
		sugar: food.nutrients?.sugar ?? 0,
		food_id: food.id,
		water_intake: 0,
		meal_type: mealType
	};
}
