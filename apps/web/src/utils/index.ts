import { frequentFoods, getFoodItem, type MealType } from "@nutri-track/core";

export const getMealType = (date: Date): MealType => {
	const hour = date.getHours();

	if (hour >= 5 && hour < 11) {
		return "breakfast";
	}

	if (hour >= 11 && hour < 12) {
		return "brunch";
	}

	if (hour >= 12 && hour < 16) {
		return "lunch";
	}

	if (hour >= 18 && hour < 23) {
		return "dinner";
	}

	if ((hour >= 0 && hour < 4) || hour >= 23) {
		return "late-night";
	}

	return "snacks";
};

export const getFrequentFoods = (region: string, mealType: MealType): string[] => {
	let frequeuntFoodIds = [];
	if (!Object.hasOwn(frequentFoods, region)) {
		return [];
	}
	if (mealType === "late-night") {
		mealType = "dinner";
	}
	frequeuntFoodIds = frequentFoods[region][mealType];
	if (mealType === "brunch") {
		frequeuntFoodIds = [...frequentFoods[region].breakfast, ...frequentFoods[region].lunch];
	}
	return frequeuntFoodIds.map((id: string) => getFoodItem(id)?.itemName || "");
};

export const getSQLiteDateFormat = (date: Date): string => {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
};

export const getSQLiteDateTimeFormat = (date: Date): string => {
	const formattedDate = getSQLiteDateFormat(date);
	const formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
	return `${formattedDate} ${formattedTime}`;
};
