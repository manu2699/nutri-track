import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Cookie, MoonStar, Plus, Sun, Sunrise } from "lucide-react";
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
import { type SaveParams, SearchAndAddFood } from "@/components/organisms/searchAndTrack";
import { TrackingDetails, type UpdateParams } from "@/components/organisms/trackingDetails";
import { useDataStore } from "@/data/store";
import type { TrackingResults } from "@/types";
import { getMealType } from "@/utils";

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
	const consumedCalories = useDataStore((s) => s.consumedCalories);

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
			className="page flex flex-col p-2 py-4 gap-2"
		>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col items-center justify-center h-full gap-3 -mt-10"
			>
				<p className="text-lg font-bold text-secondary-foreground text-center">
					Hey {currentUser.name}, <br></br>Had your {mealType}?
				</p>
				<Accordion type="single" collapsible className="w-full px-2 rounded-md shadow-md" defaultValue={mealType}>
					{Object.entries(mealTypesList).map(([key, value]) => (
						<AccordionItem key={key} value={key}>
							<AccordionTrigger className="flex items-center justify-between">
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center gap-4">
										{value.icon && <value.icon className="size-4 primary-bg" />}
										{value.name}
									</div>
									<MinimalCalorieRender calories={consumedCalories[value.type]} />
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
											<DrawerContent className="!h-max !max-h-[90%]">
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
									<DrawerContent className="h-full p-3">
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
		</motion.div>
	);
};
