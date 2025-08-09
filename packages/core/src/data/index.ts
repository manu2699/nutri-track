import foods from "./foods.db.json";
import frequents from "./frequents.json";

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
	id: string;
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
	[region: string]:
		| RegionMealTypes
		| {
				Indian_Regional: string[];
				International: string[];
		  };
}

export const foodData: Record<string, FoodItem> = foods;
export const foodItemsKeys: string[] = Object.keys(foodData);
export const foodItems: FoodItem[] = Object.values(foodData);

export const frequentFoods: FrequentFoods = frequents;
