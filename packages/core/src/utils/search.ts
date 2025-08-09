import Fuse from "fuse.js";

import { type FoodItem, foodItems } from "../data";

export interface SearchResult {
	score: number;
	item: FoodItem;
	refIndex: number;
}

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
