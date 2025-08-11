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
	AutoComplete,
	BADGE_VARIANTS,
	Badge,
	BUTTON_SIZES,
	BUTTON_VARIANTS,
	Button,
	debounce,
	Input
} from "@nutri-track/ui";

import { FoodCard } from "@/components/foodCard";
import { NutriFactCard } from "@/components/nutriFactCard";
// import { UserHeader } from "@/components/userHeader";
import { useDataStore } from "@/data/store";
import { getMealType } from "@/utils";

const frequentFoods = ["Pancakes", "Eggs", "Oatmeal", "Chicken", "Beef", "Fish", "Vegetables", "Fruits"];

export const HomePage = () => {
	const currentUser = useDataStore((s) => s.currentUser);
	const [eaten, setEaten] = useState(0);
	const [searchedFood, setSearchedFood] = useState("");
	const autocompleteRef = useRef<{
		focus: () => void;
	}>(null);

	const [mealType] = useState(getMealType(new Date()));
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
	const [consumedInfo, setConsumedInfo] = useState<FoodItem | null>(null);

	const handleSearchChange = (value: string) => {
		setIsLoading(true);
		const results = searchFood(value);
		setSearchResults(results as SearchResult[]);
		setIsLoading(false);
	};

	const handleSelectItem = (_: string, item: FoodItem) => {
		setSelectedItem(item as FoodItem);
		setEaten(getMeasurementInfo(item.calorieMeasurement).quantity);
		setSearchedFood(item.itemName);
	};

	const debounceCalculateIntakeFacts = useCallback(
		debounce((item: FoodItem, value: number) => {
			setConsumedInfo(() => calculateIntakeFacts(item, value));
		}, 300),
		[]
	);

	const handleChangeEaten = useCallback(
		(value: number) => {
			setEaten(value);
			if (selectedItem && `${value}`.length > 1 && value) {
				debounceCalculateIntakeFacts(selectedItem, value);
			}
		},
		[selectedItem, debounceCalculateIntakeFacts]
	);

	const handleSelectFrequentFood = (value: string) => {
		setSearchedFood(value);
		handleSearchChange(value);
		autocompleteRef.current?.focus();
	};

	const handleClear = () => {
		setSelectedItem(null);
		setSearchedFood("");
		setEaten(0);
		setConsumedInfo(null);
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
			{!selectedItem?.itemName ? (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col items-center justify-center h-full gap-6 -mt-10"
				>
					<p className="text-lg font-bold text-secondary-foreground text-center">
						Hey {currentUser.name}, <br></br>did you had your {mealType}?
					</p>
					<AutoComplete
						searchValue={searchedFood}
						onSearchChange={handleSearchChange}
						selectedValue={selectedItem?.itemName || ""}
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

					{!searchedFood && !selectedItem ? (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="flex items-center flex-wrap gap-3"
						>
							{frequentFoods.map((food) => (
								<Badge key={food} onClick={() => handleSelectFrequentFood(food)} variant={BADGE_VARIANTS.SECONDARY}>
									{food}
								</Badge>
							))}
						</motion.div>
					) : null}
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col py-1 h-full gap-2"
				>
					<p className="px-2 text-md mt-1">How much {selectedItem.itemName} did you had?</p>
					<div className="px-1 grid grid-cols-[1fr_auto] items-center gap-2">
						<Input
							value={eaten}
							type="number"
							onChange={(e) => handleChangeEaten(parseInt(e.target.value) || 0)}
							placeholder={`Enter amount of ${selectedItem.itemName} eaten`}
							className="w-[80%] min-w-[150px] bg-transparent"
							suffix={getMeasurementInfo(selectedItem.calorieMeasurement).unit}
						/>
						<Button variant={BUTTON_VARIANTS.OUTLINE} size={BUTTON_SIZES.SMALL} onClick={handleClear}>
							<X className="size-5 bg-gray-400 text-white rounded-full p-1" />
							Clear
						</Button>
					</div>
					<NutriFactCard
						foodItem={consumedInfo || selectedItem}
						consumedQuantity={`${eaten} ${getMeasurementInfo(selectedItem.calorieMeasurement).unit}`}
						showAction={true}
						onActionClick={handleAddToTrack}
					/>
				</motion.div>
			)}
		</motion.div>
	);
};
