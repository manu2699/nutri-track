import { useCallback, useRef, useState } from "react";
import { Show } from "control-flow-react";
import { ListChecks, Trash } from "lucide-react";
import { motion } from "motion/react";

import {
	calculateIntakeFacts,
	type FoodItem,
	getMeasurementInfo,
	type SearchResult,
	searchFood
} from "@nutri-track/core";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	AutoComplete,
	BADGE_VARIANTS,
	Badge,
	BUTTON_SIZES,
	BUTTON_VARIANTS,
	Button,
	Drawer,
	DrawerContent,
	DrawerTrigger,
	debounce,
	Input
} from "@nutri-track/ui";

import { FoodCard, FoodVitals } from "@/components/foodCard";
import { NutriFactCard } from "@/components/nutriFactCard";
// import { UserHeader } from "@/components/userHeader";
import { useDataStore } from "@/data/store";
import { getFrequentFoods, getMealType } from "@/utils";

export const HomePage = () => {
	const currentUser = useDataStore((s) => s.currentUser);
	const [mealType] = useState(getMealType(new Date()));

	const [frequentFoods] = useState<string[]>(getFrequentFoods("India/TamilNadu", mealType));
	const [searchedFood, setSearchedFood] = useState("");
	const autocompleteRef = useRef<{
		focus: () => void;
	}>(null);
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const [eatenInputs, setEatenInputs] = useState<number[]>([]);
	const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);
	const [consumedInfo, setConsumedInfo] = useState<FoodItem[]>([]);

	const handleSearchChange = (value: string) => {
		setIsLoading(true);
		const results = searchFood(value);
		setSearchResults(results as SearchResult[]);
		setIsLoading(false);
	};

	const handleSelectItem = (_: string, item: FoodItem) => {
		setSelectedItems([...selectedItems, item]);
		setEatenInputs((prev) => [...prev, getMeasurementInfo(item.calorieMeasurement).quantity]);
		setConsumedInfo((prev) => [...prev, item]);
		setSearchedFood(item.itemName);
	};

	const debounceCalculateIntakeFacts = useCallback(
		debounce((item: FoodItem, value: number, index: number) => {
			setConsumedInfo((prev) => prev.map((food, i) => (i === index ? calculateIntakeFacts(item, value) : food)));
		}, 300),
		[]
	);

	const handleChangeEaten = useCallback(
		(value: number, index: number) => {
			setEatenInputs((prev) => prev.map((input, i) => (i === index ? value : input)));
			if (selectedItems.length > 0 && value) {
				debounceCalculateIntakeFacts(selectedItems[selectedItems.length - 1], value, index);
			}
		},
		[selectedItems, debounceCalculateIntakeFacts]
	);

	const handleSelectFrequentFood = (value: string) => {
		setSearchedFood(value);
		handleSearchChange(value);
		autocompleteRef.current?.focus();
	};

	const handleClear = () => {
		setSearchedFood("");
	};

	const handleRemoveItem = (itemId: string, index: number) => {
		const updatedItems = selectedItems.filter((item) => item.id !== itemId);
		const updatedConsumed = consumedInfo.filter((_, i) => i !== index);
		const updatedEatenInputs = eatenInputs.filter((_, i) => i !== index);
		setSelectedItems(updatedItems);
		setEatenInputs(updatedEatenInputs);
		setConsumedInfo(updatedConsumed);
	};

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
				<AutoComplete
					searchValue={searchedFood}
					onSearchChange={handleSearchChange}
					selectedValue={selectedItems.length > 0 ? selectedItems[selectedItems.length - 1].itemName || "" : ""}
					onSelectValue={handleSelectItem}
					isLoading={isLoading}
					emptyMessage="No Items found..."
					items={searchResults.map((result) => ({
						item: result.item,
						label: result.item.itemName,
						value: result.item.itemName
					}))}
					className="w-full max-w-full"
					forwardedRef={autocompleteRef}
					onClear={handleClear}
					itemRenderer={(item) => <FoodCard key={item.value} foodItem={item.item} />}
				/>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="flex items-center flex-wrap gap-3 mb-4"
				>
					{frequentFoods.map((food) => (
						<Show when={food} key={food}>
							<Badge key={food} onClick={() => handleSelectFrequentFood(food)} variant={BADGE_VARIANTS.SECONDARY}>
								{food}
							</Badge>
						</Show>
					))}
				</motion.div>
				{selectedItems.length > 0 && (
					<Accordion
						type="single"
						collapsible
						className="w-full border px-2 rounded-md"
						defaultValue={selectedItems[0].id}
					>
						{selectedItems.map((item, index) => (
							<AccordionItem key={item.id} value={item.id}>
								<AccordionTrigger>{item.itemName}</AccordionTrigger>
								<AccordionContent className="flex flex-col items-center gap-2 self-center">
									{/*<p className="px-2 text-md">How much did you had?</p>*/}
									<div className="px-1 w-[70%] flex items-center gap-4">
										<Input
											value={eatenInputs[index]}
											type="number"
											onChange={(e) => handleChangeEaten(parseInt(e.target.value) || 0, index)}
											placeholder={`How much did you had?`}
											className="w-[80%] min-w-[150px] bg-transparent"
											suffix={getMeasurementInfo(item.calorieMeasurement).unit}
										/>
										<Button
											variant={BUTTON_VARIANTS.OUTLINE}
											size={BUTTON_SIZES.SMALL}
											onClick={() => handleRemoveItem(item.id, index)}
											className="!p-2 rounded-full"
										>
											<Trash className="size-4 !text-destructive" />
										</Button>
									</div>
									{/* Vital stats */}
									<FoodVitals
										calories={consumedInfo[index].calories}
										fats={consumedInfo[index]?.nutrients?.proteins}
										carbs={consumedInfo[index]?.nutrients?.carbs}
										proteins={consumedInfo[index]?.nutrients?.proteins}
									/>
									{/* Full Stats */}
									<Drawer>
										<DrawerTrigger asChild>
											<Button
												variant={BUTTON_VARIANTS.OUTLINE}
												size={BUTTON_SIZES.SMALL}
												className="border-2 !border-primary text-primary bg-accent"
											>
												<ListChecks className="size-4" />
												View Detailed Info
											</Button>
										</DrawerTrigger>
										<DrawerContent>
											<NutriFactCard
												className="border-0"
												foodItem={consumedInfo[index]}
												consumedQuantity={`${eatenInputs[index]} ${getMeasurementInfo(consumedInfo[index].calorieMeasurement).unit}`}
											/>
										</DrawerContent>
									</Drawer>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				)}
				{consumedInfo.length > 0 && (
					<Accordion
						type="single"
						className="w-full border-4 bg-accent border-double px-2 rounded-md"
						defaultValue={"total-consumed"}
					>
						<AccordionItem value="total-consumed">
							<AccordionTrigger>Total Consumed</AccordionTrigger>
							<AccordionContent className="flex flex-col items-center gap-2">
								<FoodVitals
									fats={consumedInfo.reduce((acc, item) => acc + (item.nutrients?.totalFats || 0), 0)}
									carbs={consumedInfo.reduce((acc, item) => acc + (item.nutrients?.carbs || 0), 0)}
									proteins={consumedInfo.reduce((acc, item) => acc + (item.nutrients?.proteins || 0), 0)}
									calories={consumedInfo.reduce((acc, item) => acc + (item.calories || 0), 0)}
								/>
								<Button
									variant={BUTTON_VARIANTS.SECONDARY}
									size={BUTTON_SIZES.SMALL}
									// className="border-2 !border-primary text-primary bg-accent"
								>
									<ListChecks className="size-4" />
									Add to Trackings
								</Button>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				)}
			</motion.div>
		</motion.div>
	);
};
