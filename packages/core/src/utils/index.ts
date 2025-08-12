import Fuse from "fuse.js";

import { type FoodItem, foodData, foodItems, type Nutrients } from "../data";

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
export const getFoodItem = (itemId: string): FoodItem | undefined => {
	if (foodData[itemId]) {
		return foodData[itemId] as FoodItem;
	}
	return undefined;
};

/**
 * Parses a serving string like "100ml" or "1piece" into structured data.
 * @param input - Raw serving string
 * @returns ParsedServing with amount and unit
 */
export const getMeasurementInfo = (measurement: string) => {
	const match = measurement.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)$/);
	if (!match) throw new Error(`Invalid format: ${measurement}`);
	return {
		quantity: Number(match[1]),
		unit: match[2]
	};
};

/**
 * Calculates the intake value per 100g or 100ml of a food item.
 * @param consumedValue - Quantity consumed
 * @param per100Values - Nutritional value per 100g or 100ml
 * @returns Calculated intake value
 */
const calculateIntakeValuePer100 = (consumedValue: number, per100Values: number) =>
	Math.floor((consumedValue / 100) * per100Values);

/**
 * Calculates the intake value per unit of a food item.
 * @param consumedValue - Quantity consumed
 * @param perUnitValues - Nutritional value per unit
 * @returns Calculated intake value
 */
const calculateIntakeValuePerUnit = (consumedValue: number, perUnitValues: number) => consumedValue * perUnitValues;

/**
 * Calculates the intake facts for a food item based on the consumed quantity.
 * @param foodItem - Food item to calculate intake for
 * @param quantity - Quantity consumed
 * @returns FoodItem with updated calorie and nutrient values
 */
export const calculateIntakeFacts = (foodItem: FoodItem, quantity: number) => {
	const { unit: servingUnit } = getMeasurementInfo(foodItem.calorieMeasurement);
	console.log("servingUnit :: ", servingUnit);
	const result = JSON.parse(JSON.stringify(foodItem));
	result.nutrients = {};
	Reflect.deleteProperty(result, "searchKeys");
	Reflect.deleteProperty(result, "note");

	if (["g", "ml", "gm"].includes(servingUnit)) {
		result.calories = calculateIntakeValuePer100(quantity, foodItem.calories);
		Object.entries(foodItem.nutrients as Record<keyof Nutrients, number | null>).forEach(
			([key, value]: [string, number | null]) => {
				if (value) {
					result.nutrients[key as keyof Nutrients] = calculateIntakeValuePer100(quantity, value as number);
				}
			}
		);
	} else if (servingUnit === "piece") {
		result.calories = calculateIntakeValuePerUnit(quantity, foodItem.calories);
		Object.entries(foodItem.nutrients as Record<keyof Nutrients, number | null>).forEach(
			([key, value]: [string, number | null]) => {
				if (value) {
					result.nutrients[key as keyof Nutrients] = calculateIntakeValuePerUnit(quantity, value as number);
				}
			}
		);
	}
	return result;
};

export * from "./vitals";
