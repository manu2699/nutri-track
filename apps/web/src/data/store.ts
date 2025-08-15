import { create } from "zustand";

import type { FoodItem, MealType } from "@nutri-track/core";

import { NutriTrackDB, TrackingController, UserController } from "./database";
import type { UserInterface } from "./database/users";

type State = {
	dbRef?: NutriTrackDB;
	trackingController?: TrackingController;
	userController?: UserController;
	isInitialized: boolean;
	currentUser: UserInterface | null;
	todaysTrackings: FoodItem[] | null;
};

type Action = {
	initialize: () => Promise<void>;
	setCurrentUser: (user: UserInterface) => void;
	clearDb?: () => Promise<void>;
	getTrackingsForToday: () => Promise<void>;
	addTracking: (tracking: FoodItem, mealType: MealType) => Promise<void>;
};

export const useDataStore = create<State & Action>((set, get) => ({
	isInitialized: false,
	currentUser: null,
	todaysTrackings: [],
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
			const trackings = await trackingController.getTracking(user.id);
			console.log("Today's Trackings: ", trackings);
		}
	},
	addTracking: async (tracking: FoodItem, mealType: MealType) => {
		const trackingController = get().trackingController;
		const user = get().currentUser;
		if (trackingController && user?.id) {
			await trackingController.addTracking(user.id, tracking, mealType);
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
