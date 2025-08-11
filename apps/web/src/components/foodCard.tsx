import { Flame } from "lucide-react";

import type { FoodItem } from "@nutri-track/core";
// import { BUTTON_SIZES, BUTTON_VARIANTS, Button, useAccessibleClick } from "@nutri-track/ui";

export const FoodCard = ({
	foodItem,
	className
}: {
	foodItem: FoodItem;
	onClick?: () => void;
	tabIndex?: number;
	className?: string;
}) => {
	return (
		<div className={`flex flex-col gap-2 p-1 ${className}`}>
			<div className={"flex items-center justify-between"}>
				<div>
					<span>{foodItem.itemName}</span>
				</div>
				<span className="flex items-baseline">
					<Flame className="size-3 text-xs self-center" />
					<span className="text-black">{foodItem.calories}</span>
					<span className="text-sm ml-1 text-gray-500">kcal/{foodItem.calorieMeasurement}</span>
				</span>
			</div>
			<span className="flex text-sm gap-4">
				<div className="flex items-center gap-2">
					<span className="text-gray-500">Protein</span>
					<span>
						<span className="text-black text-sm">{foodItem.nutrients?.proteins}</span>
						<span className="text-sm text-gray-500">g</span>
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-gray-500">Carbs</span>
					<span>
						<span className="text-black text-sm">{foodItem.nutrients?.carbs}</span>
						<span className="text-sm text-gray-500">g</span>
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-gray-500">Fat</span>
					<span>
						<span className="text-black text-sm">{foodItem.nutrients?.totalFats}</span>
						<span className="text-sm text-gray-500">g</span>
					</span>
				</div>
			</span>
		</div>
	);
};
