import { useCallback, useEffect, useState } from "react";
import { Bean, ChevronRight, Cookie, Droplets, Flame, Leaf, MoonStar, Plus, Sun, Sunrise } from "lucide-react";
import { motion } from "motion/react";

import { MealTypeEnums, MealTypeLabelEnums } from "@nutri-track/core";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	BUTTON_SIZES,
	BUTTON_VARIANTS,
	Button,
	Drawer,
	DrawerContent,
	DrawerTrigger
} from "@nutri-track/ui";

import { MinimalCalorieRender, MinimalVitals } from "@/components/foodCard";
import { Navigation } from "@/components/navigation";
import { type SaveParams, SearchAndAddFood } from "@/components/organisms/searchAndTrack";
import { TrackingDetails, type UpdateParams } from "@/components/organisms/trackingDetails";
import { WaveProgressCard } from "@/components/progressCard";
import { useDataStore } from "@/data/store";
import type { TrackingResults } from "@/types";
import { getDisplayTime, getMealType } from "@/utils";

const mealTypesList = {
	[MealTypeLabelEnums.breakfast]: {
		name: MealTypeLabelEnums.breakfast,
		type: MealTypeEnums.breakfast,
		icon: Sunrise
	},
	[MealTypeLabelEnums.lunch]: {
		name: MealTypeLabelEnums.lunch,
		type: MealTypeEnums.lunch,
		icon: Sun
	},
	[MealTypeLabelEnums.snacks]: {
		name: MealTypeLabelEnums.snacks,
		type: MealTypeEnums.snacks,
		icon: Cookie
	},
	[MealTypeLabelEnums.dinner]: {
		name: MealTypeLabelEnums.dinner,
		type: MealTypeEnums.dinner,
		icon: MoonStar
	}
};

export const HomePage = () => {
	const currentUser = useDataStore((s) => s.currentUser);
	const trackings = useDataStore((s) => s.todaysTrackings);
	const consumedStats = useDataStore((s) => s.consumedStats || {});

	const [mealType] = useState(getMealType(new Date()));
	const [editOpenedFor, setEditOpenedFor] = useState(-1);
	const [isNewEntryOpened, setIsNewEntryOpened] = useState(false);

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
			setIsNewEntryOpened(false);
		},
		[fetchData]
	);

	const handleDelete = useCallback(
		async (tracking: TrackingResults) => {
			await useDataStore.getState().deleteTracking(tracking.id);
			setEditOpenedFor(-1);
			fetchData();
		},
		[fetchData]
	);

	const handleUpdate = useCallback(
		async ({ consumedInfo, eatenInput, trackingData }: UpdateParams) => {
			await useDataStore.getState().updateTracking(trackingData.id, consumedInfo, eatenInput);
			fetchData();
			setEditOpenedFor(-1);
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
				<Accordion type="single" collapsible className="w-full px-2 rounded-md shadow-md" defaultValue={mealType}>
					{Object.entries(mealTypesList).map(([key, value]) => (
						<AccordionItem key={key} value={key}>
							<AccordionTrigger className="flex items-center justify-between">
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center gap-4">
										{value.icon && <value.icon className="size-4 primary-bg" />}
										{value.name}
									</div>
									<MinimalCalorieRender calories={consumedStats[value.type]?.calories} />
								</div>
							</AccordionTrigger>
							<AccordionContent className="flex flex-col items-center gap-2 w-full">
								{trackings?.[value.type]?.length > 0 &&
									trackings?.[value.type]?.map((tracking) => (
										<Drawer
											key={tracking.id}
											open={editOpenedFor === tracking.id}
											onOpenChange={(isOpen) => setEditOpenedFor(isOpen ? tracking.id : -1)}
										>
											<DrawerTrigger asChild>
												<div className="flex w-full justify-between items-center gap-5 border-b-[0.5px] border-b-primary">
													<div className="px-2 py-1 flex flex-col justify-between w-full gap-1 ">
														<div className="flex items-center justify-between w-full">
															<p>{tracking.foodDetails?.itemName}</p>
															<MinimalCalorieRender calories={tracking.calories} />
														</div>
														<MinimalVitals
															className="flex !items-start !justify-normal gap-1"
															proteins={tracking.protein}
															fats={tracking.fat}
															carbs={tracking.carbs}
														/>
													</div>
													<Button
														variant={BUTTON_VARIANTS.SECONDARY}
														size={BUTTON_SIZES.SMALL}
														className="rounded-full !p-2"
													>
														<ChevronRight className="size-4" />
													</Button>
												</div>
											</DrawerTrigger>
											<DrawerContent className="!h-[80vh]">
												<TrackingDetails
													consumed={tracking.consumed}
													consumedScale={tracking.scale}
													trackingData={tracking}
													foodDetails={tracking.foodDetails}
													onUpdate={handleUpdate}
													onDelete={() => handleDelete(tracking)}
												/>
											</DrawerContent>
										</Drawer>
									))}
								<Drawer open={isNewEntryOpened} onOpenChange={setIsNewEntryOpened}>
									<DrawerTrigger asChild>
										<Button size={BUTTON_SIZES.SMALL} className="self-end mt-2">
											<Plus className="size-4" />
											Add
										</Button>
									</DrawerTrigger>
									<DrawerContent className="!h-[80vh] p-3">
										<SearchAndAddFood
											currentUser={currentUser}
											mealType={value.type}
											onSave={handleSave}
											onDiscard={() => setIsNewEntryOpened(false)}
										/>
									</DrawerContent>
								</Drawer>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</motion.div>
			<div className="mt-auto">
				<Navigation />
			</div>
		</motion.div>
	);
};
