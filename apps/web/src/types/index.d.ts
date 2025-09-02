import type { FoodItem } from "@nutri-track/core";

import type { TrackingDataInterface } from "@/data/database/trackings";

export interface TrackingResults extends TrackingDataInterface {
	foodDetails: FoodItem | null;
}

export type ProgressTimeFrame = "month-to-date" | "past-month" | "past-week" | "custom";
