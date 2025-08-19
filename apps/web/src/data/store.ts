import { create } from "zustand";

import { type FoodItem, getFoodItem, type MealType } from "@nutri-track/core";

import type { TrackingResults } from "@/types";
import { getSQLiteDateFormat } from "@/utils";

import { NutriTrackDB, TrackingController, UserController } from "./database";
import type { TrackingDataInterface } from "./database/trackings";
import type { UserInterface } from "./database/users";

type State = {
	dbRef?: NutriTrackDB;
	trackingController?: TrackingController;
	userController?: UserController;
	isInitialized: boolean;
	currentUser: UserInterface | null;
	todaysTrackings: Record<string, TrackingResults[]>;
	consumedCalories: Record<string, number>;
};

type Action = {
	initialize: () => Promise<void>;
	setCurrentUser: (user: UserInterface) => void;
	clearDb?: () => Promise<void>;
	getTrackingsForToday: () => Promise<void>;
	addTracking: (tracking: FoodItem, consumed: number, mealType: MealType) => Promise<void>;
	deleteTracking: (id: number) => Promise<void>;
	updateTracking: (trackingId: number, consumedInfo: FoodItem, eatenInput: number) => Promise<void>;
};

export const useDataStore = create<State & Action>((set, get) => ({
	isInitialized: false,
	currentUser: null,
	todaysTrackings: {},
	consumedCalories: {},
	initialize: async () => {
		const dbRef = new NutriTrackDB();
		await dbRef.initialize();
		const userController = new UserController(dbRef);
		const trackingController = new TrackingController(dbRef);
		const user = await userController.getUserById(1);
		if (user) {
			console.log("User found :: ", user);
			set({
				currentUser: user
			});
		}
		set({
			dbRef,
			trackingController,
			userController,
			isInitialized: true
		});
		// await get().clearDb();
	},
	setCurrentUser: (user: UserInterface) => {
		set({
			currentUser: user
		});
	},
	getTrackingsForToday: async () => {
		const trackingController = get().trackingController;
		const user = get().currentUser;
		if (trackingController && user?.id) {
			const trackings = (await trackingController.getTracking(user.id, getSQLiteDateFormat(new Date()))) || [];

			const grouped: Partial<Record<string, TrackingDataInterface[] | null>> = Object.groupBy(
				trackings,
				(i) => i.meal_type
			);
			const result: Record<string, TrackingResults[]> = {};
			const consumedCalories: Record<string, number> = {
				total: 0
			};
			for (const [key, value] of Object.entries(grouped)) {
				if (!value || !value.length) {
					continue;
				}
				if (!result[key]) {
					result[key] = [];
				}
				if (!consumedCalories[key]) {
					consumedCalories[key] = 0;
				}
				value.forEach((tracking) => {
					result[key].push({
						...tracking,
						foodDetails: getFoodItem(tracking.food_id)
					});
					consumedCalories[key] += tracking.calories;
					consumedCalories.total += tracking.calories;
				});
			}

			set({
				todaysTrackings: result,
				consumedCalories
			});
		}
	},
	addTracking: async (tracking: FoodItem, consumed: number, mealType: MealType) => {
		const trackingController = get().trackingController;
		const user = get().currentUser;
		if (trackingController && user?.id) {
			await trackingController.addTracking({ userId: user.id, foodItem: tracking, consumed, mealType });
		}
	},
	deleteTracking: async (trackingId: number) => {
		const trackingController = get().trackingController;
		const user = get().currentUser;
		if (trackingController && user?.id) {
			return await trackingController.deleteTracking(user.id, trackingId);
		}
	},
	updateTracking: async (trackingId: number, consumedInfo: FoodItem, eatenInput: number) => {
		const trackingController = get().trackingController;
		const user = get().currentUser;
		if (trackingController && user?.id) {
			await trackingController.updateTracking({
				trackingId,
				userId: user.id,
				foodItem: consumedInfo,
				consumed: eatenInput
			});
		}
	},
	// Only for dev purposes
	clearDb: async () => {
		if (!import.meta.env.DEV) {
			return;
		}
		const userController = get().userController;
		if (userController) {
			await userController.dropTable();
		}
		const trackingController = get().trackingController;
		if (trackingController) {
			await trackingController.dropTable();
		}
	}
}));
