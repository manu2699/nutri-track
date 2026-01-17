import { Cookie, MoonStar, Sun, Sunrise } from "lucide-react";

import { MealTypeEnums, MealTypeLabelEnums } from "@nutri-track/core";

export const mealTypesList = {
	[MealTypeLabelEnums.breakfast]: {
		name: MealTypeLabelEnums.breakfast,
		type: MealTypeEnums.breakfast,
		icon: Sunrise
	},
	[MealTypeLabelEnums.lunch]: {
		name: MealTypeLabelEnums.lunch,
		type: MealTypeEnums.lunch,
		icon: Sun
	},
	[MealTypeLabelEnums.snacks]: {
		name: MealTypeLabelEnums.snacks,
		type: MealTypeEnums.snacks,
		icon: Cookie
	},
	[MealTypeLabelEnums.dinner]: {
		name: MealTypeLabelEnums.dinner,
		type: MealTypeEnums.dinner,
		icon: MoonStar
	}
};
