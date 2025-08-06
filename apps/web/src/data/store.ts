import { create } from "zustand";

import { NutriTrackDB, TrackingController, UserController } from "./database";
import type { UserInterface } from "./database/users";

type State = {
	dbRef?: NutriTrackDB;
	trackingController?: TrackingController;
	userController?: UserController;
	isInitialized: boolean;
	currentUser: UserInterface | null;
};

type Action = {
	initialize: () => Promise<void>;
	setCurrentUser: (user: UserInterface) => void;
};

export const useDataStore = create<State & Action>((set) => ({
	isInitialized: false,
	currentUser: null,
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
	},
	setCurrentUser: (user: UserInterface) => {
		set({
			currentUser: user
		});
	}
}));
