import {
	type ActivityLevelTypes,
	calculateBMR,
	calculateLeanBodyMass,
	calculateProteinRequired
} from "@nutri-track/core";

import type { NutriTrackDB } from ".";

export const userTableSchema = `CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
age INTEGER NOT NULL,
email TEXT NOT NULL,
gender TEXT CHECK(gender IN ('male', 'female')) NOT NULL,
weight REAL NOT NULL,
height REAL NOT NULL,
body_type TEXT,
bmi REAL DEFAULT 0,
bmr REAL DEFAULT 0,
body_fat INTEGER DEFAULT 0,
activity_level TEXT,
protein_required REAL DEFAULT 0,
region TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

export interface UserInterface {
	id?: number;
	name: string;
	age: number;
	email: string;
	gender: "male" | "female";
	weight: number;
	height: number;
	bmi?: number;
	bmr?: number;
	body_fat?: number;
	activity_level: ActivityLevelTypes;
	region: string;
	protein_required?: number;
	created_at?: string;
	updated_at?: string;
}

export class UserController {
	db: NutriTrackDB;

	constructor(db: NutriTrackDB) {
		this.db = db;
	}

	async createUser(userData: UserInterface) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const { name, age, email, gender, weight, height, activity_level, body_fat, bmi, region } = userData;
		let bmr = 0;
		let proteinRequired = 0;
		if (body_fat) {
			const leanBodyMass = calculateLeanBodyMass(weight, body_fat);
			bmr = calculateBMR(leanBodyMass);
			proteinRequired = calculateProteinRequired(leanBodyMass, activity_level || "sedentary");
		}

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: `INSERT INTO users (name, age, email, gender, weight, height, bmi, bmr, activity_level, body_fat, protein_required, region)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			bind: [name, age, email, gender, weight, height, bmi, bmr, activity_level, body_fat, proteinRequired, region]
		});

		const { result } = await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "SELECT * FROM users WHERE name = ? AND email = ? AND gender = ? AND age = ?",
			bind: [name, email, gender, age],
			rowMode: "object",
			returnValue: "resultRows"
		});

		console.log("NTDB :: Created user", result);

		if (result.resultRows.length === 0) {
			throw new Error("User not created");
		}

		return result.resultRows[0] as UserInterface;
	}

	async updateUser(userId: number, userData: UserInterface) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const updates = [];
		const values = [];

		Object.entries(userData).forEach(([key, value]) => {
			if (value !== undefined) {
				updates.push(`${key} = ?`);
				values.push(value);
			}
		});

		if (updates.length === 0) return false;

		// TODO: Recalculate BMI and BMR if weight, height, age, or gender changed
		// if (["weight", "height", "age", "gender"].some((field) => userData[field] !== undefined)) {
		// 	const user = await this.getUserById(userId);
		// 	const newWeight = userData.weight || user.weight;
		// 	const newHeight = userData.height || user.height;
		// 	const newAge = userData.age || user.age;
		// 	const newGender = userData.gender || user.gender;

		// 	updates.push("bmi = ?", "bmr = ?");

		// 	values.push(calculateBMI(newWeight, newHeight), calculateBMR(newWeight, newHeight, newAge, newGender));
		// }

		updates.push("updated_at = CURRENT_TIMESTAMP");
		values.push(userId);

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
			bind: values
		});

		return true;
	}

	async getUserById(userId: number) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}
		const { result } = await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "SELECT * FROM users WHERE id = ?",
			bind: [userId],
			rowMode: "object",
			returnValue: "resultRows"
		});

		console.log("NTDB :: Get user by id", result);
		return result.resultRows.length > 0 ? (result.resultRows[0] as UserInterface) : null;
	}

	async getAllUsers() {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}
		const { result } = await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "SELECT * FROM users ORDER BY created_at DESC",
			rowMode: "object",
			returnValue: "resultRows"
		});
		console.log("NTDB :: Get all users", result);
		return result.resultRows as UserInterface[];
	}

	async deleteUser(userId: number) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}
		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "DELETE FROM users WHERE id = ?",
			bind: [userId]
		});
	}

	// Only for dev purposes
	async deleteAllUsers() {
		if (!import.meta.env.DEV) {
			return;
		}
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "DELETE FROM users"
		});
		// To reset the auto-increment counter
		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "DELETE FROM sqlite_sequence WHERE name = 'users'"
		});
	}

	async dropTable() {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: "DROP TABLE users"
		});
	}
}
