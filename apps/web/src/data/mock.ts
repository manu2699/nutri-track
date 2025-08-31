import {
	ActivityLevelEnum,
	foodItems,
	foodItemsKeys,
	getMeasurementInfo,
	type MealType,
	MealTypeEnums,
	regions
} from "@nutri-track/core";

import type { UserInterface } from "./database/users";
import { useDataStore } from "./store";

function getRandomBetween(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomQuantity(unit: string): number {
	switch (unit) {
		case "g":
		case "gm":
			return getRandomBetween(50, 300);
		case "ml":
			return getRandomBetween(100, 500);
		case "piece":
			return getRandomBetween(1, 4);
		case "tbsp":
			return getRandomBetween(1, 5);
		default:
			return getRandomBetween(1, 3);
	}
}

const mealTypes = [MealTypeEnums.breakfast, MealTypeEnums.lunch, MealTypeEnums.snacks, MealTypeEnums.dinner];

// Generate mock tracking data for a given timeframe
export async function loadMockTrackingData(startDate: Date, endDate: Date) {
	const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
	const addTracking = useDataStore.getState().addTracking;

	for (let i = 0; i < days; i++) {
		const date = new Date(startDate);
		date.setDate(startDate.getDate() + i);

		// Simulate 2-4 meals per day
		const mealsCount = getRandomBetween(2, 4);
		for (let m = 0; m < mealsCount; m++) {
			const foodIdx = getRandomBetween(0, foodItemsKeys.length - 1);
			const foodInfo = foodItems[foodIdx];

			const mealType = mealTypes[getRandomBetween(0, mealTypes.length - 1)];
			const { unit } = getMeasurementInfo(foodInfo.calorieMeasurement);

			const consumedQuantity = getRandomQuantity(unit);

			await addTracking(foodInfo, consumedQuantity, mealType, date);
		}
	}
}

export async function createMockUser() {
	const userController = useDataStore.getState().userController;
	const user: UserInterface = {
		name: `Deva`,
		email: `deva@example.com`,
		age: 25,
		gender: `male`,
		height: 174,
		weight: 79,
		body_fat: 23,
		bmi: 24.8,
		activity_level: ActivityLevelEnum.LightlyActive,
		region: regions[0]
	};
	if (userController) await userController.createUser(user);
}
