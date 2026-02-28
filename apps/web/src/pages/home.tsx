import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";

import { MealAccordion } from "@/components/MealAccordion";
import { Navigation } from "@/components/navigation";
import type { SaveParams } from "@/components/organisms/searchAndTrack";
import type { UpdateParams } from "@/components/organisms/trackingDetails";
import { DashboardStatsCard } from "@/components/progressCard";
import { useDataStore } from "@/data/store";
import type { TrackingResults } from "@/types";
import { getDisplayTime, getMealType } from "@/utils";

export const HomePage = () => {
	const currentUser = useDataStore((s) => s.currentUser);
	const trackings = useDataStore((s) => s.todaysTrackings);
	const consumedStats = useDataStore((s) => s.consumedStats || {});

	const [mealType] = useState(getMealType(new Date()));

	const fetchData = useCallback(() => {
		useDataStore.getState().getTrackingsForToday();
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSave = useCallback(
		async ({ consumedInfo, eatenInputs, mealType }: SaveParams) => {
			await Promise.all(
				consumedInfo.map((consumed, index) =>
					useDataStore.getState().addTracking(consumed, eatenInputs[index], mealType)
				)
			);
			fetchData();
		},
		[fetchData]
	);

	const handleDelete = useCallback(
		async (tracking: TrackingResults) => {
			await useDataStore.getState().deleteTracking(tracking.id);
			fetchData();
		},
		[fetchData]
	);

	const handleUpdate = useCallback(
		async ({ consumedInfo, eatenInput, trackingData }: UpdateParams) => {
			await useDataStore.getState().updateTracking(trackingData.id, consumedInfo, eatenInput);
			fetchData();
		},
		[fetchData]
	);

	if (!currentUser) {
		return null;
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="page flex flex-col p-2 !py-4 gap-2 !h-full"
		>
			<div>
				<p className="font-bold text-sm">{currentUser.name}</p>
				<p className="text-xs">{getDisplayTime(new Date())}</p>
			</div>

			<div className="w-full px-2 mt-2 mb-2">
				<DashboardStatsCard
					caloriesConsumed={consumedStats.total?.calories || 0}
					caloriesTarget={currentUser.bmr || 2000}
					proteinConsumed={consumedStats.total?.protein || 0}
					proteinTarget={currentUser.protein_required || 100}
					fatConsumed={consumedStats.total?.fat || 0}
					fatTarget={70}
					fiberConsumed={consumedStats.total?.fiber || 0}
					fiberTarget={30}
				/>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col items-center justify-self-center justify-center h-max gap-2 mt-4"
			>
				<p className="self-start subHeading text-gray-500 text-sm">Todays Trackings</p>
				<MealAccordion
					trackings={trackings}
					consumedStats={consumedStats}
					editable={true}
					showEmptyMeals={true}
					defaultExpanded={mealType}
					currentUser={currentUser}
					onSave={handleSave}
					onUpdate={handleUpdate}
					onDelete={handleDelete}
				/>
			</motion.div>
			<div className="mt-auto">
				<Navigation />
			</div>
		</motion.div>
	);
};
