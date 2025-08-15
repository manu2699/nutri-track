import { useState } from "react";
// import { Show } from "control-flow-react";
import { Check, Search } from "lucide-react";
import { motion } from "motion/react";

import { standardMealTypesMap } from "@nutri-track/core";
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
	DrawerFooter,
	DrawerTrigger
} from "@nutri-track/ui";

import { SearchAndAddFood } from "@/components/organisms/searchAndTrack";
// import { UserHeader } from "@/components/userHeader";
import { useDataStore } from "@/data/store";
import { getMealType } from "@/utils";

export const HomePage = () => {
	const currentUser = useDataStore((s) => s.currentUser);
	const [mealType] = useState(getMealType(new Date()));

	if (!currentUser) {
		return null;
	}

	// const handleAddToTrack = (foodItem: FoodItem) => {
	// 	console.log("handleAddToTrack :: ", foodItem);
	// };

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
				<Accordion type="single" collapsible className="w-full px-2 rounded-md" defaultValue={mealType}>
					{Object.entries(standardMealTypesMap).map(([key, value]) => (
						<AccordionItem key={key} value={key}>
							<AccordionTrigger className="flex items-center justify-between">{value}</AccordionTrigger>

							<AccordionContent className="flex flex-col items-center gap-2">
								<Drawer>
									<DrawerTrigger asChild>
										<Button variant={BUTTON_VARIANTS.SECONDARY} size={BUTTON_SIZES.SMALL}>
											<Search className="size-4" />
											Search & Track
										</Button>
									</DrawerTrigger>
									<DrawerContent className="h-full p-3">
										<SearchAndAddFood currentUser={currentUser} mealType={key} />
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
