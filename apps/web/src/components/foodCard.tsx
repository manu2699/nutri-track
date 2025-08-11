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
		<div className={`flex items-center justify-between ${className}`}>
			<div>
				<span>{foodItem.itemName}</span>
			</div>
			<span className="text-xs flex items-baseline">
				<Flame className="size-3 self-center" />
				<span className="text-black text-md">{foodItem.calories}</span>
				<span className="text-xs ml-1 text-gray-500">kcal/{foodItem.calorieMeasurement}</span>
			</span>
			{/* <Button
				size={BUTTON_SIZES.SMALL}
				variant={BUTTON_VARIANTS.OUTLINE}
				className="w-max p-0 rounded-full !text-sm"
				{...clickProps}
			>
				<Plus className="w-4 h-4" />
			</Button> */}
		</div>
	);
};
