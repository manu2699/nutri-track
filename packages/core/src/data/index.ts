import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface Nutrients {
	totalFats: number | null;
	saturatedFats: number | null;
	unSaturatedFats: number | null;
	sugar: number | null;
	carbs: number | null;
	proteins: number | null;
	sodium: number | null;
	potassium: number | null;
	magnesium: number | null;
	vitaminA: number | null;
	vitaminC: number | null;
	vitaminD: number | null;
	fiber: number | null;
	calcium: number | null;
	iron: number | null;
}

export interface FoodItem {
	itemName: string;
	calories: number;
	calorieMeasurement: string;
	nutrients: Nutrients;
	taste: string;
	region: string[];
	mealType: string[];
	isVeg: boolean;
	isVegan: boolean;
	note: string;
	description: string;
	searchKeys?: string[];
}

export interface RegionMealTypes {
	breakfast: string[];
	lunch: string[];
	dinner: string[];
	snacks: string[];
}

export interface FrequentFoods {
	[region: string]: RegionMealTypes;
}

const foodsDbFile = join(process.cwd(), "src/data/foods.db.json");
const frequentsFile = join(process.cwd(), "src/data/frequents.json");

export const foodData: Record<string, FoodItem> = JSON.parse(readFileSync(foodsDbFile, "utf8"));
export const foodItemsKeys: string[] = Object.keys(foodData);
export const foodItems: FoodItem[] = Object.values(foodData);

export const frequentFoods: FrequentFoods = JSON.parse(readFileSync(frequentsFile, "utf8"));
