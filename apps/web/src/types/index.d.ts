import type { FoodItem } from "@nutri-track/core";

import type { TrackingDataInterface } from "@/data/database/trackings";

export interface TrackingResults extends TrackingDataInterface {
	foodDetails: FoodItem | null;
}
