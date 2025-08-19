import Fuse from "fuse.js";

import { type FoodItem, foodData, foodItems } from "../data";

export interface SearchResult {
	score: number;
	item: FoodItem;
	refIndex: number;
}

/**
 * Performs fussy search for food items based on a query string.
 * @param query - Search term to match against food item names and search keys
 * @returns Array of SearchResult objects with matching food items
 */
export const searchFood = (query: string): SearchResult[] => {
	const fuse = new Fuse(foodItems, {
		minMatchCharLength: 2,
		findAllMatches: true,
		threshold: 0.4,
		includeScore: true,
		keys: ["itemName", "searchKeys"]
	});
	return fuse.search(query) as SearchResult[];
};

/**
 * Retrieves a food item by its unique ID.
 * @param itemId - Unique identifier for the food item
 * @returns FoodItem if found, otherwise undefined
 */
export const getFoodItem = (itemId: string): FoodItem | null => {
	if (foodData[itemId]) {
		return foodData[itemId] as FoodItem;
	}
	return null;
};

export type ActivityLevelTypes = "Sedentary" | "Lightly Active" | "Moderately Active" | "Active" | "Very Active";
export enum ActivityLevelEnum {
	Sedentary = "Sedentary",
	LightlyActive = "Lightly Active",
	ModeratelyActive = "Moderately Active",
	Active = "Active",
	VeryActive = "Very Active"
}

export * from "./calcs";
export * from "./vitals";
