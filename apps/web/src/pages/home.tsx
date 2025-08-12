import { useCallback, useRef, useState } from "react";
import { X } from "lucide-react";
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

import { FoodCard } from "@/components/foodCard";
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

	const [eatenInputs, setEatenInputs] = useState([0]);
	const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);
	const [consumedInfo, setConsumedInfo] = useState<FoodItem[]>([]);
	const [detailedItem, setDetailedItem] = useState<FoodItem | null>(null);

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

	const handleRemoveItem = (itemId: string) => {
		const updatedItems = selectedItems.filter((item) => item.id !== itemId);
		setSelectedItems(updatedItems);
		// setEaten(getMeasurementInfo(updatedItems[updatedItems.length - 1].calorieMeasurement).quantity);
		// setSearchedFood(updatedItems[updatedItems.length - 1].itemName);
	};

	if (!currentUser) {
		return null;
	}

	const handleAddToTrack = (foodItem: FoodItem) => {
		console.log("handleAddToTrack :: ", foodItem);
	};

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
					Hey {currentUser.name}, <br></br>did you had your {mealType}?
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
					className="flex items-center flex-wrap gap-3"
				>
					{frequentFoods.map((food) => (
						<>
							{food ? (
								<Badge key={food} onClick={() => handleSelectFrequentFood(food)} variant={BADGE_VARIANTS.SECONDARY}>
									{food}
								</Badge>
							) : null}
						</>
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
								<AccordionContent className="flex flex-col gap-3">
									<p className="px-2 text-md">How much {item.itemName} did you had?</p>
									<div className="px-1 grid grid-cols-[1fr_auto] items-center gap-2">
										<Input
											value={eatenInputs[index]}
											type="number"
											onChange={(e) => handleChangeEaten(parseInt(e.target.value) || 0, index)}
											placeholder={`Enter amount of ${item.itemName} eaten`}
											className="w-[80%] min-w-[150px] bg-transparent"
											suffix={getMeasurementInfo(item.calorieMeasurement).unit}
										/>
										<Button
											variant={BUTTON_VARIANTS.OUTLINE}
											size={BUTTON_SIZES.SMALL}
											onClick={() => handleRemoveItem(item.id)}
										>
											<X className="size-5 bg-gray-400 text-white rounded-full p-1" />
											Remove
										</Button>
									</div>
									<div className="grid grid-cols-3 justify-around gap-6 w-3/4 self-center">
										{consumedInfo[index]?.nutrients?.proteins && (
											<div className="p-2 text-xs text-center rounded-md bg-gray-50 border border-secondary">
												Protein <p className="text-base">{consumedInfo[index].nutrients.proteins}g</p>
											</div>
										)}
										{consumedInfo[index]?.nutrients?.carbs && (
											<div className="p-2 text-xs text-center rounded-md bg-gray-50 border border-secondary">
												Carbs <p className="text-base">{consumedInfo[index].nutrients.carbs}g</p>
											</div>
										)}
										{consumedInfo[index]?.nutrients?.totalFats && (
											<div className="p-2 text-xs text-center rounded-md bg-gray-50 border border-secondary">
												Fat <p className="text-base">{consumedInfo[index].nutrients.totalFats}g</p>
											</div>
										)}
									</div>
									<Drawer>
										<DrawerTrigger asChild>
											<Button
												variant={BUTTON_VARIANTS.SECONDARY}
												size={BUTTON_SIZES.SMALL}
												className="self-end justify-self-end"
												onClick={() => setDetailedItem(consumedInfo[index])}
											>
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
			</motion.div>
		</motion.div>
	);
};
