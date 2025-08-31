import { create } from "zustand";

import { type FoodItem, getFoodItem, type MealType, MealTypeEnums } from "@nutri-track/core";

import type { TrackingResults } from "@/types";
import { getSQLiteDateFormat } from "@/utils";

import { NutriTrackDB, TrackingController, UserController } from "./database";
import type { TrackingDataInterface } from "./database/trackings";
import type { UserInterface } from "./database/users";
import { createMockUser, loadMockTrackingData } from "./mock";

type State = {
	dbRef?: NutriTrackDB;
	trackingController?: TrackingController;
	userController?: UserController;
	isInitialized: boolean;
	currentUser: UserInterface | null;
	todaysTrackings: Record<string, TrackingResults[]>;
	consumedStats: Record<string, Record<string, number>>;
};

type Action = {
	initialize: () => Promise<void>;
	setCurrentUser: (user: UserInterface) => void;
	clearDb?: () => Promise<void>;
	cleanAndLoadMockData?: () => void;
	getTrackingsForToday: () => Promise<void>;
	addTracking: (tracking: FoodItem, consumed: number, mealType: MealType, date?: Date | undefined) => Promise<void>;
	deleteTracking: (id: number) => Promise<void>;
	updateTracking: (trackingId: number, consumedInfo: FoodItem, eatenInput: number) => Promise<void>;
};

export const useDataStore = create<State & Action>((set, get) => ({
	isInitialized: false,
	currentUser: null,
	todaysTrackings: {},
	consumedStats: {},
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
		// get().cleanAndLoadMockData?.();
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
			const consumedStats: Record<string, Record<string, number>> = {
				total: { calories: 0, protein: 0, fat: 0, fiber: 0 },
				[MealTypeEnums.breakfast]: { calories: 0, protein: 0, fat: 0, fiber: 0 },
				[MealTypeEnums.lunch]: { calories: 0, protein: 0, fat: 0, fiber: 0 },
				[MealTypeEnums.snacks]: { calories: 0, protein: 0, fat: 0, fiber: 0 },
				[MealTypeEnums.dinner]: { calories: 0, protein: 0, fat: 0, fiber: 0 }
			};
			for (const [key, value] of Object.entries(grouped)) {
				if (!value || !value.length) {
					continue;
				}
				if (!result[key]) {
					result[key] = [];
				}
				value.forEach((tracking) => {
					result[key].push({
						...tracking,
						foodDetails: getFoodItem(tracking.food_id)
					});
					consumedStats[key].calories += tracking.calories;
					consumedStats[key].protein += tracking.protein ?? 0;
					consumedStats[key].fat += tracking.fat ?? 0;
					consumedStats[key].fiber += tracking.fiber ?? 0;

					consumedStats.total.calories += tracking.calories;
					consumedStats.total.protein += tracking.protein ?? 0;
					consumedStats.total.fat += tracking.fat ?? 0;
					consumedStats.total.fiber += tracking.fiber ?? 0;
				});
			}

			set({
				todaysTrackings: result,
				consumedStats
			});
		}
	},
	addTracking: async (tracking: FoodItem, consumed: number, mealType: MealType, date = undefined) => {
		const trackingController = get().trackingController;
		const user = get().currentUser;
		if (trackingController && user?.id) {
			await trackingController.addTracking({ userId: user.id, foodItem: tracking, consumed, mealType, date });
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
			await userController.deleteAllUsers();
			// await userController.dropTable();
		}
		const trackingController = get().trackingController;
		if (trackingController) {
			await trackingController.deleteAllTrackings();
			// await trackingController.dropTable();
		}
	},
	cleanAndLoadMockData: () => {
		if (import.meta.env.DEV) {
			get().clearDb?.();
			createMockUser().then(() => {
				const currentDate = new Date();
				const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
				// let monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
				loadMockTrackingData(monthStart, currentDate);
			});
		}
	}
}));
