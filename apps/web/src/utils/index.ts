import type { MealType } from "@/types";

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
