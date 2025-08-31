import { create } from "zustand";

import { type FoodItem, getFoodItem, type MealType, MealTypeEnums } from "@nutri-track/core";

import type { TrackingResults } from "@/types";
import { getSQLiteDateFormat } from "@/utils";

import { NutriTrackDB, TrackingController, UserController } from "./database";
import type { TrackingDataInterface } from "./database/trackings";
import type { UserInterface } from "./database/users";
import { createMockUser, loadMockTrackingData } from "./mock";

type TimeFrame = "month-to-date" | "past-month" | "past-week";

interface ProgressData {
	date: string;
	total_calories: number;
	total_protein: number;
	total_fat: number;
	total_fiber: number;
	daily_trackings: TrackingDataInterface[];
}

type State = {
	dbRef?: NutriTrackDB;
	trackingController?: TrackingController;
	userController?: UserController;
	isInitialized: boolean;
	currentUser: UserInterface | null;
	todaysTrackings: Record<string, TrackingResults[]>;
	consumedStats: Record<string, Record<string, number>>;
	progressData: ProgressData[];
	selectedTimeFrame: TimeFrame;
};

type Action = {
	initialize: () => Promise<void>;
	setCurrentUser: (user: UserInterface) => void;
	clearDb?: () => Promise<void>;
	cleanAndLoadMockData?: () => void;
	getTrackingsForToday: () => Promise<void>;
	getProgressData: (timeFrame: TimeFrame) => Promise<void>;
	addTracking: (tracking: FoodItem, consumed: number, mealType: MealType, date: Date | undefined) => Promise<void>;
	deleteTracking: (id: number) => Promise<void>;
	updateTracking: (trackingId: number, consumedInfo: FoodItem, eatenInput: number) => Promise<void>;
	setSelectedTimeFrame: (timeFrame: TimeFrame) => void;
};

export const useDataStore = create<State & Action>((set, get) => ({
	isInitialized: false,
	currentUser: null,
	todaysTrackings: {},
	consumedStats: {},
	progressData: [],
	selectedTimeFrame: "month-to-date" as TimeFrame,
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
			const result = await trackingController.addTracking({
				userId: user.id,
				foodItem: tracking,
				consumed,
				mealType,
				date
			});
			if (result) {
				console.log(`Tracking added for ${tracking.itemName} on ${date}`, result);
			}
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
	},
	getProgressData: async (timeFrame: TimeFrame) => {
		const trackingController = get().trackingController;
		const user = get().currentUser;
		if (trackingController && user?.id) {
			const currentDate = new Date();
			let startDate: Date;

			switch (timeFrame) {
				case "month-to-date":
					startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
					break;
				case "past-month":
					startDate = new Date(currentDate);
					startDate.setMonth(startDate.getMonth() - 1);
					break;
				case "past-week":
					startDate = new Date(currentDate);
					startDate.setDate(startDate.getDate() - 7);
					break;
			}

			const data = await trackingController.getTrackingHistory(
				user.id,
				getSQLiteDateFormat(startDate),
				getSQLiteDateFormat(currentDate)
			);

			const processedData = data.map((item) => ({
				...item,
				daily_trackings: JSON.parse(`[${item.daily_trackings}]`) as TrackingDataInterface[]
			}));
			set({ progressData: processedData });
		}
	},
	setSelectedTimeFrame: (timeFrame: TimeFrame) => {
		set({ selectedTimeFrame: timeFrame });
	}
}));
