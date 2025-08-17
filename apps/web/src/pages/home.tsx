import { useEffect, useState } from "react";
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
import { SearchAndAddFood } from "@/components/organisms/searchAndTrack";
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
	const [trackings, setTrackings] = useState<Record<string, TrackingResults[]>>({});
	const [mealType] = useState(getMealType(new Date()));

	useEffect(() => {
		useDataStore
			.getState()
			.getTrackingsForToday()
			.then(() => {
				const grouped = Object.groupBy(useDataStore.getState().todaysTrackings || [], (i) => i.meal_type);
				const result: Record<string, TrackingResults[]> = {};
				for (const [key, value] of Object.entries(grouped)) {
					if (value) {
						result[key] = value;
					}
				}
				setTrackings(result);
			});
	}, []);

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
								<div className="flex items-center gap-4">
									{value.icon && <value.icon className="size-4 primary-bg" />}
									{value.name}
								</div>
							</AccordionTrigger>
							<AccordionContent className="flex flex-col items-center gap-2 w-full">
								{trackings?.[value.type]?.length > 0 &&
									trackings?.[value.type]?.map((tracking) => (
										<Drawer key={tracking.id}>
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
															carbs={tracking.carbohydrates}
														/>
													</div>
													<Button
														variant={BUTTON_VARIANTS.OUTLINE}
														size={BUTTON_SIZES.SMALL}
														className="rounded-full !p-2"
													>
														<ChevronRight className="size-4" />
													</Button>
												</div>
											</DrawerTrigger>
											<DrawerContent></DrawerContent>
										</Drawer>
									))}
								<Drawer>
									<DrawerTrigger asChild>
										<Button size={BUTTON_SIZES.SMALL} className="self-end rounded-full mt-2 !p-2">
											<Plus className="size-4" />
										</Button>
									</DrawerTrigger>
									<DrawerContent className="h-full p-3">
										<SearchAndAddFood currentUser={currentUser} mealType={value.type} />
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
