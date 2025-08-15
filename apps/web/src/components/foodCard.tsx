import { Show } from "control-flow-react";
import { Bean, Droplets, Flame, Wheat } from "lucide-react";

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

export const FoodVitals = ({
	fats,
	carbs,
	proteins,
	calories,
	className
}: {
	proteins: number | undefined | null;
	fats?: number | undefined | null;
	carbs?: number | undefined | null;
	calories?: number | undefined | null;
	className?: string;
}) => {
	return (
		<div className={`flex items-center flex-grow-0 flex-shrink-0 basis-16 justify-around gap-3 ${className}`}>
			<Show when={calories}>
				<div className="min-w-16 p-2 text-xs text-center rounded-md border border-secondary">
					<span className="flex items-center gap-1">
						<Flame className="size-4" />
						Calories
					</span>
					<p className="text-base">
						{calories}
						<span className="text-sm text-gray-500 ml-1">kcal</span>
					</p>
				</div>
			</Show>
			<Show when={proteins}>
				<div className="min-w-16 p-2 text-xs text-center rounded-md border border-secondary">
					<span className="flex items-center gap-1">
						<Bean className="size-4" />
						Protein
					</span>
					<p className="text-base">
						{typeof proteins === "number" ? parseFloat(`${proteins}`).toFixed(1) : "-"}
						<span className="text-sm text-gray-500 ml-1">g</span>
					</p>
				</div>
			</Show>
			<Show when={carbs}>
				<div className="min-w-16 p-2 text-xs text-center rounded-md border border-secondary">
					<span className="flex items-center gap-1">
						<Wheat className="size-4" />
						Carbs
					</span>
					<p className="text-base">
						{typeof carbs === "number" ? parseFloat(`${carbs}`).toFixed(1) : "-"}
						<span className="text-sm text-gray-500 ml-1">g</span>
					</p>
				</div>
			</Show>
			<Show when={fats}>
				<div className="min-w-16 p-2 text-xs text-center rounded-md border border-secondary">
					<span className="flex items-center gap-1">
						<Droplets className="size-4" />
						Fat
					</span>
					<p className="text-base">
						{typeof fats === "number" ? parseFloat(`${fats}`).toFixed(1) : "-"}
						<span className="text-sm text-gray-500 ml-1">g</span>
					</p>
				</div>
			</Show>
		</div>
	);
};
