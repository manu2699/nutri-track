import Fuse from "fuse.js";

import { foodItems } from "../data";

export const searchFood = (query: string) => {
	const fuse = new Fuse(foodItems, {
		minMatchCharLength: 2,
		findAllMatches: true,
		threshold: 0.4,
		includeScore: true,
		keys: ["itemName", "searchKeys"]
	});
	return fuse.search(query);
};
