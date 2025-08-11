import { useRef, useState } from "react";
import { Check, X } from "lucide-react";

import { type FoodItem, type SearchResult, searchFood } from "@nutri-track/core";
import { AutoComplete, BADGE_VARIANTS, Badge, Input } from "@nutri-track/ui";

import { FoodCard } from "@/components/foodCard";
import { UserHeader } from "@/components/userHeader";
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

	const handleSearchChange = (value: string) => {
		setIsLoading(true);
		const results = searchFood(value);
		setSearchResults(results as SearchResult[]);
		setIsLoading(false);
	};

	const handleSelectItem = (_: string, item: FoodItem) => {
		setSelectedItem(item as FoodItem);
		setSearchedFood(item.itemName);
	};

	const handleSelectFrequentFood = (value: string) => {
		setSearchedFood(value);
		handleSearchChange(value);
		autocompleteRef.current?.focus();
	};

	if (!currentUser) {
		return null;
	}

	return (
		<div className="page flex flex-col !p-0">
			<UserHeader name={currentUser.name} id={currentUser.id} />
			<div className="flex flex-col p-4">
				<div className="flex flex-col justify-center items-center gap-5">
					<h2 className="text-xl text-center font-bold text-secondary-foreground mt-3">Had your {mealType}?</h2>
					<AutoComplete
						searchValue={searchedFood}
						onSearchChange={handleSearchChange}
						selectedValue={selectedItem?.itemName}
						onSelectValue={handleSelectItem}
						isLoading={isLoading}
						emptyMessage="No Items found..."
						items={searchResults.map((result) => ({
							item: result.item,
							label: result.item.itemName,
							value: result.item.itemName
						}))}
						className="w-[90%] max-w-md"
						forwardedRef={autocompleteRef}
						itemRenderer={(item) => <FoodCard key={item.value} foodItem={item.item} />}
					/>

					{!searchedFood && !selectedItem ? (
						<div className="flex items-center flex-wrap gap-3">
							{frequentFoods.map((food) => (
								<Badge key={food} onClick={() => handleSelectFrequentFood(food)} variant={BADGE_VARIANTS.SECONDARY}>
									{food}
								</Badge>
							))}
						</div>
					) : null}

					{selectedItem && (
						<div className="flex flex-col w-[90%] bg-gray-50 px-4 py-2  rounded-md">
							<p className="font-semibold mb-1">
								{selectedItem.itemName} Breakdown for {selectedItem.calorieMeasurement}
							</p>
							<p className="text-sm">
								Calories: {selectedItem.calories}{" "}
								<span className="text-xs">kcal/{selectedItem.calorieMeasurement}</span>
							</p>
							<p className="text-sm">Carbs: {selectedItem.nutrients.carbs}g</p>
							<p className="text-sm">Protein: {selectedItem.nutrients.proteins}g</p>
							<p className="text-sm">Fats: {selectedItem.nutrients.totalFats}g</p>
							<p className="text-sm">Fiber: {selectedItem.nutrients.fiber}g</p>

							<p className="text-md mt-2">How much {selectedItem.itemName} did you eat?</p>
							<div className="grid grid-cols-[1fr_auto] items-center gap-2">
								<Input
									value={eaten}
									onChange={(e) => setEaten(parseInt(e.target.value) || 0)}
									placeholder={`Enter amount of ${selectedItem.itemName} eaten`}
									className="w-full max-w-md bg-transparent"
									suffix={selectedItem.calorieMeasurement}
								/>
								<div className="flex items-center justify-center gap-2">
									<Check className="size-5 bg-primary text-white rounded-full p-1" />
									<X className="size-5 bg-gray-400 text-white rounded-full p-1" />
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
