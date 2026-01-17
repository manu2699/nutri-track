import { useCallback, useEffect, useState } from "react";
import { Bean, Droplets, Flame, Leaf } from "lucide-react";
import { motion } from "motion/react";

import { MealAccordion } from "@/components/MealAccordion";
import { Navigation } from "@/components/navigation";
import type { SaveParams } from "@/components/organisms/searchAndTrack";
import type { UpdateParams } from "@/components/organisms/trackingDetails";
import { WaveProgressCard } from "@/components/progressCard";
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

			<div className="flex align-center p-2 gap-3 justify-center pt-10">
				<WaveProgressCard
					percentage={((consumedStats.total?.calories || 1) / (currentUser.bmr || 2000)) * 100}
					className={"!w-[220px] !h-full"}
				>
					<div className="flex flex-col items-center gap-1">
						<p className="flex items-center gap-1 text-sm font-mono">
							<Flame className="size-4" />
							Calories
						</p>
						<p className="text-xs">
							<span className="text-base font-bold">{consumedStats.total?.calories}</span> off{" "}
							<span className="text-sm mx-1">{currentUser.bmr}</span> kcal
						</p>
					</div>
				</WaveProgressCard>
				<div className="flex flex-col items-center gap-3">
					<WaveProgressCard
						percentage={((consumedStats.total?.protein || 1) / (currentUser.protein_required || 100)) * 100}
						className={"!w-[100px] !h-[100px]"}
					>
						<div className="flex flex-col items-center gap-1">
							<p className="flex items-center gap-1 text-xs font-mono">
								<Bean className="size-3" />
								Proteins
							</p>
							<p className="text-xs">
								<span className="text-sm font-bold">{Math.round(consumedStats.total?.protein)}</span> off{" "}
								<span className="mx-1">{currentUser.protein_required} gm</span>
							</p>
						</div>
					</WaveProgressCard>
					<div className="flex flex-col p-2 justify-center gap-1 w-[100px] h-[100px] rounded-xl shadow-md bg-accent">
						<p className="flex items-center justify-evenly gap-1 text-[12px] text-gray-500">
							<span className="flex items-center gap-1 font-mono">
								<Droplets className="size-2" />
								Fats
							</span>
							<span className="font-bold text-xs text-black">{Math.round(consumedStats.total?.fat)} gm</span>
						</p>
						<p className="flex items-center justify-evenly gap-1 text-[12px] text-gray-500">
							<span className="flex items-center gap-1 font-mono">
								<Leaf className="size-2" />
								Fiber
							</span>
							<span className="font-bold text-xs text-black">{Math.round(consumedStats.total?.fiber)} gm</span>
						</p>
					</div>
				</div>
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
