import {
	type ActivityLevelTypes,
	calculateAMR,
	calculateBMI,
	calculateBMR,
	calculateBodyFatBasedOnBMI,
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
target_protein REAL,
target_calories REAL,
amr REAL,
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
	target_protein?: number;
	target_calories?: number;
	amr?: number;
	created_at?: string;
	updated_at?: string;
}

export class UserController {
	db: NutriTrackDB;

	constructor(db: NutriTrackDB) {
		this.db = db;
	}

	private calculateVitals(user: Partial<UserInterface>) {
		const weight = user.weight || 0;
		const height = user.height || 0;
		const age = user.age || 0;
		const gender = user.gender || "male";
		const activity_level = user.activity_level || "Sedentary";

		const bmi = weight && height ? calculateBMI(weight, height) : 0;
		const body_fat = user.body_fat || (bmi ? calculateBodyFatBasedOnBMI(bmi, age, gender) : 0);
		const lean_body_mass = calculateLeanBodyMass(weight || 0, body_fat);
		const bmr = calculateBMR(lean_body_mass);
		const protein_required = calculateProteinRequired(lean_body_mass, activity_level);
		const amr = calculateAMR(bmr, activity_level);

		return { bmi, body_fat, bmr, protein_required, amr };
	}

	async createUser(userData: UserInterface) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const vitals = this.calculateVitals(userData);
		const finalData = { ...userData, ...vitals };

		// Defaults
		finalData.target_protein = finalData.target_protein ?? vitals.protein_required;
		finalData.target_calories = finalData.target_calories ?? vitals.bmr;

		const { name, age, email, gender, weight, height, activity_level, region, target_protein, target_calories } =
			finalData;

		const { bmi, body_fat, bmr, protein_required, amr } = vitals;

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: `INSERT INTO users (name, age, email, gender, weight, height, bmi, bmr, activity_level, body_fat, protein_required, target_protein, target_calories, amr, region)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			bind: [
				name,
				age,
				email,
				gender,
				weight,
				height,
				bmi,
				bmr,
				activity_level,
				body_fat,
				protein_required,
				target_protein,
				target_calories,
				amr,
				region
			]
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

	async updateUser(userId: number, userData: Partial<UserInterface>) {
		if (!this.db.promiser || !this.db.dbId) {
			throw new Error("Database not initialized");
		}

		const user = await this.getUserById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		const mergedData = { ...user, ...userData };
		const vitals = this.calculateVitals(mergedData);
		const finalData = { ...userData, ...vitals };

		const updates = [];
		const values = [];

		Object.entries(finalData).forEach(([key, value]) => {
			if (value !== undefined) {
				updates.push(`${key} = ?`);
				values.push(value);
			}
		});

		if (updates.length === 0) return false;

		updates.push("updated_at = CURRENT_TIMESTAMP");
		values.push(userId);

		await this.db.promiser("exec", {
			dbId: this.db.dbId,
			sql: `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
			bind: values
		});

		return this.getUserById(userId);
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
