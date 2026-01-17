import type { FoodItem, MealType } from "@nutri-track/core";

import { getSQLiteDateTimeFormat } from "@/utils";

import type { NutriTrackDB } from ".";

export const trackingTableSchema = `CREATE TABLE IF NOT EXISTS trackings (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
time DATETIME DEFAULT CURRENT_TIMESTAMP,
calories REAL DEFAULT 0,
consumed INTEGER DEFAULT 0,
scale TEXT,
protein REAL DEFAULT 0,
carbs REAL DEFAULT 0,
fat REAL DEFAULT 0,
fiber REAL DEFAULT 0,
sugar REAL DEFAULT 0,
food_id TEXT DEFAULT NULL,
water_intake REAL DEFAULT 0,
meal_type TEXT DEFAULT 'breakfast',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users (id),
UNIQUE(user_id, time, food_id)
)`;

export interface TrackingDataInterface {
	id: number;
	user_id: number;
	food_id: string;
	time: string;
	calories: number;
	consumed: number;
	scale: string;
	protein: number;
	carbs: number;
	fat?: number;
	fiber?: number;
	sugar?: number;
	water_intake?: number;
	created_at: string;
	meal_type: string;
}

export interface ProgressData {
	date: string;
	total_calories: number;
	total_protein: number;
	total_fat: number;
	total_fiber: number;
	daily_trackings: TrackingDataInterface[];
}

export class TrackingController {
	db: NutriTrackDB;
	constructor(db: NutriTrackDB) {
		this.db = db;
	}
	async addTracking({
		userId,
		foodItem,
		consumed,
		mealType,
		date = undefined
	}: {
		userId: number;
		foodItem: FoodItem;
		consumed: number;
		mealType: MealType;
		date?: Date;
	}) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const fields = ["user_id"];
		const values: (number | string)[] = [userId];

		if (date && date instanceof Date) {
			fields.push("created_at", "time");
			values.push(getSQLiteDateTimeFormat(date), getSQLiteDateTimeFormat(date));
		}

		const serializedData = serializeFoodToTracking(foodItem, consumed, mealType);
		Object.entries(serializedData).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				fields.push(key);
				values.push(value as number | string);
			}
		});

		return await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: `INSERT INTO trackings (${fields.join(", ")})
                VALUES (${Array(fields.length).fill("?").join(", ")})`,
			bind: values
		});
	}

	async updateTracking({
		trackingId,
		userId,
		foodItem,
		consumed
	}: {
		trackingId: number;
		userId: number;
		foodItem: FoodItem;
		consumed: number;
	}) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const updates: string[] = [];
		const values = [];

		const serializedData = serializeTrackingUpdate(foodItem, consumed);
		Object.entries(serializedData).forEach(([key, value]) => {
			if (value !== undefined) {
				updates.push(`${key} = ?`);
				values.push(value);
			}
		});

		if (updates.length === 0) return false;

		values.push(userId);
		values.push(trackingId);

		return await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: `UPDATE trackings SET ${updates.join(", ")}
                WHERE user_id = ? AND id = ?`,
			bind: values
		});
	}

	async getTracking(userId: number, time?: string) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const { result } = await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "SELECT * FROM trackings WHERE user_id = ? AND time LIKE ?",
			bind: [userId, `${time}%`],
			returnValue: "resultRows",
			rowMode: "object"
		});

		console.log("NTDB :: get trackings ", result);

		return result.resultRows.length > 0 ? (result.resultRows as TrackingDataInterface[]) : null;
	}

	async getTrackingHistory(userId: number, startDate: string, endDate: string) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const { result } = await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: `SELECT 
				strftime('%Y-%m-%d', time) as date,
				SUM(calories) as total_calories,
				SUM(protein) as total_protein,
				SUM(fat) as total_fat,
				SUM(fiber) as total_fiber,
				GROUP_CONCAT(json_object(
					'id', id,
					'food_id', food_id,
					'calories', calories,
					'protein', protein,
					'fat', fat,
					'fiber', fiber,
					'consumed', consumed,
					'meal_type', meal_type,
					'time', time,
					'scale', scale
				)) as daily_trackings
			FROM trackings
			WHERE user_id = ? 
			AND time BETWEEN ? AND ?
			GROUP BY strftime('%Y-%m-%d', time)
			ORDER BY date ASC`,
			bind: [userId, startDate, endDate],
			returnValue: "resultRows",
			rowMode: "object"
		});

		return result.resultRows as Array<{
			date: string;
			total_calories: number;
			total_protein: number;
			total_fat: number;
			total_fiber: number;
			daily_trackings: string;
		}>;
	}

	async deleteTracking(userId: number, id: number) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "DELETE FROM trackings WHERE user_id = ? AND id = ?",
			bind: [userId, id]
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

export function serializeFoodToTracking(food: FoodItem, consumed: number, mealType: MealType): TrackingSerializer {
	return {
		calories: food.calories,
		scale: food.calorieMeasurement,
		consumed,
		protein: food.nutrients?.proteins ?? 0,
		carbs: food.nutrients?.carbs ?? 0,
		fat: food.nutrients?.totalFats ?? 0,
		fiber: food.nutrients?.fiber ?? 0,
		sugar: food.nutrients?.sugar ?? 0,
		food_id: food.id,
		water_intake: 0,
		meal_type: mealType
	};
}

interface TrackingUpdateInterface
	extends Pick<TrackingSerializer, "calories" | "consumed" | "protein" | "carbs" | "fat" | "fiber" | "sugar"> {}

export function serializeTrackingUpdate(food: FoodItem, consumed: number): TrackingUpdateInterface {
	return {
		calories: food.calories,
		consumed,
		protein: food.nutrients?.proteins ?? 0,
		carbs: food.nutrients?.carbs ?? 0,
		fat: food.nutrients?.totalFats ?? 0,
		fiber: food.nutrients?.fiber ?? 0,
		sugar: food.nutrients?.sugar ?? 0
	};
}
