import { useRef, useState } from "react";

import { type FoodItem, type SearchResult, searchFood } from "@nutri-track/core";
import { AutoComplete, BADGE_VARIANTS, Badge, BUTTON_SIZES, Button } from "@nutri-track/ui";

import { UserHeader } from "@/components/userHeader";
import { useDataStore } from "@/data/store";
import { getMealType } from "@/utils";

const frequentFoods = ["Pancakes", "Eggs", "Oatmeal", "Chicken", "Beef", "Fish", "Vegetables", "Fruits"];

export const HomePage = () => {
	const currentUser = useDataStore((s) => s.currentUser);
	const [eaten, setEaten] = useState("");
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

	const handleSelectItem = (value: SearchResult) => {
		setSelectedItem(value.item);
		setEaten(value.item.itemName);
	};

	const handleSelectFrequentFood = (value: string) => {
		setEaten(value);
		handleSearchChange(value);
		autocompleteRef.current?.focus();
	};

	return (
		<div className="page flex flex-col !p-0">
			{currentUser?.id ? <UserHeader name={currentUser.name} id={currentUser.id} /> : null}
			<div className="flex flex-col p-4">
				<div className="flex flex-col justify-center items-center gap-5">
					<h2 className="text-xl subHeading text-center font-bold text-secondary mt-3">Had your {mealType}?</h2>
					{/* TODO : need to implement suggestion based on user input */}

					<AutoComplete
						searchValue={eaten}
						onSearchChange={handleSearchChange}
						selectedValue={selectedItem?.itemName}
						isLoading={isLoading}
						emptyMessage="No Items found..."
						items={searchResults.map((item) => ({
							label: item.item.itemName,
							value: item.item.itemName
						}))}
						className="w-[90%] max-w-md"
						forwardedRef={autocompleteRef}
						itemsRenderer={() => (
							<ul className="max-h-60 overflow-y-auto">
								{searchResults.map((item) => (
									<li key={item.refIndex} className="p-1 cursor-pointer hover:bg-gray-100">
										<div className="flex flex-col items-center justify-between">
											<span>{item.item.itemName}</span>
											<span>Cal: {item.item.calories}</span>
										</div>
										<Button
											size={BUTTON_SIZES.SMALL}
											variant={BADGE_VARIANTS.DEFAULT}
											className="w-max self-end"
											onClick={() => handleSelectItem(item)}
										>
											Add
										</Button>
									</li>
								))}
							</ul>
						)}
					/>

					{!eaten && !selectedItem ? (
						<div className="flex items-center flex-wrap gap-3">
							{frequentFoods.map((food) => (
								<Badge key={food} onClick={() => handleSelectFrequentFood(food)} variant={BADGE_VARIANTS.SECONDARY}>
									{food}
								</Badge>
							))}
						</div>
					) : null}

					{selectedItem && (
						<div className="flex flex-col w-[90%] bg-gray-100 px-4 py-2  rounded-md">
							<p className="font-bold">
								You have eaten {selectedItem.itemName} for {mealType}
							</p>
							<p className="text-sm">Nutri Breakdown</p>
							<p className="text-sm">Calories: {selectedItem.calories}</p>
							<p className="text-sm">Protein: {selectedItem.nutrients.proteins}g</p>
							<p className="text-sm">Carbs: {selectedItem.nutrients.carbs}g</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
