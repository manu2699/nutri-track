// A card that show all nutritional facts

import { Plus } from "lucide-react";

import { type FoodItem, standardNutrientsMeasurementMap } from "@nutri-track/core";
import {
	BUTTON_SIZES,
	BUTTON_VARIANTS,
	Button,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader
} from "@nutri-track/ui";

export const NutriFactCard = ({
	foodItem,
	consumedQuantity,
	showAction,
	onActionClick,
	className
}: {
	foodItem: FoodItem;
	consumedQuantity?: string;
	showAction?: boolean;
	onActionClick?: (foodItem: FoodItem) => void;
	className?: string;
}) => {
	return (
		<Card className={`py-4 gap-4 ${className}`}>
			<CardHeader className="pb-2 font-bold border-0 border-b-4 border-primary">
				{foodItem.itemName}'s Nutri Facts {consumedQuantity && `for ${consumedQuantity}`}
			</CardHeader>
			<CardDescription className="px-6">{foodItem.description}</CardDescription>
			<CardContent className={"text-sm"}>
				<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
					<span>Energy</span>
					<span className="font-bold text-md">
						{!consumedQuantity
							? `${foodItem.calories} kcal/${foodItem.calorieMeasurement}`
							: `${foodItem.calories} kcal for ${consumedQuantity}`}
					</span>
				</div>
				<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
					<span>Protein</span>
					<span className="font-bold text-md">
						{foodItem.nutrients?.proteins} {standardNutrientsMeasurementMap.proteins}
					</span>
				</div>
				<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
					<span>Fiber</span>
					<span className="font-bold text-md">
						{foodItem.nutrients?.fiber} {standardNutrientsMeasurementMap.fiber}
					</span>
				</div>
				<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
					<span>Carbohydrates</span>
					<span className="font-bold text-md">
						{foodItem.nutrients?.carbs} {standardNutrientsMeasurementMap.carbs}
					</span>
				</div>
				<div className="flex flex-col mb-2 pb-1 border-0 border-b-2 border-primary">
					<div className="flex justify-between">
						<span>Total Fats</span>
						<span className="font-bold text-md">
							{foodItem.nutrients?.totalFats} {standardNutrientsMeasurementMap.totalFats}
						</span>
					</div>
					<div className="pl-4 pb-1">
						<div className="flex justify-between">
							<span>Saturated Fat</span>
							<span className="font-bold text-md">
								{foodItem.nutrients?.saturatedFats} {standardNutrientsMeasurementMap.saturatedFats}
							</span>
						</div>
						{foodItem.nutrients?.unSaturatedFats && (
							<div className="flex justify-between">
								<span>Unsaturated Fat</span>
								<span className="font-bold text-md">
									{foodItem.nutrients.unSaturatedFats} {standardNutrientsMeasurementMap.unSaturatedFats}
								</span>
							</div>
						)}
					</div>
				</div>
				<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
					<span>Sugar</span>
					<span className="font-bold text-md">
						{foodItem.nutrients?.sugar} {standardNutrientsMeasurementMap.sugar}
					</span>
				</div>
				<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
					<span>Calcium</span>
					<span className="font-bold text-md">
						{foodItem.nutrients?.calcium} {standardNutrientsMeasurementMap.calcium}
					</span>
				</div>
				<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
					<span>Iron</span>
					<span className="font-bold text-md">
						{foodItem.nutrients?.iron} {standardNutrientsMeasurementMap.iron}
					</span>
				</div>
				<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
					<span>Potassium</span>
					<span className="font-bold text-md">
						{foodItem.nutrients?.potassium} {standardNutrientsMeasurementMap.potassium}
					</span>
				</div>
				{foodItem.nutrients?.vitaminA && (
					<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
						<span>Vitamin A</span>
						<span className="font-bold text-md">
							{foodItem.nutrients.vitaminA} {standardNutrientsMeasurementMap.vitaminA}
						</span>
					</div>
				)}
				{foodItem.nutrients?.vitaminC && (
					<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
						<span>Vitamin C</span>
						<span className="font-bold text-md">
							{foodItem.nutrients.vitaminC} {standardNutrientsMeasurementMap.vitaminC}
						</span>
					</div>
				)}
				{foodItem.nutrients?.vitaminC && (
					<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
						<span>Vitamin C</span>
						<span className="font-bold text-md">
							{foodItem.nutrients.vitaminC} {standardNutrientsMeasurementMap.vitaminC}
						</span>
					</div>
				)}
				{foodItem.nutrients?.vitaminD && (
					<div className="flex justify-between mb-2 pb-1 border-0 border-b-2 border-primary">
						<span>Vitamin D</span>
						<span className="font-bold text-md">
							{foodItem.nutrients.vitaminD} {standardNutrientsMeasurementMap.vitaminD}
						</span>
					</div>
				)}
				{showAction && (
					<CardAction className="flex justify-end mt-4">
						<Button
							variant={BUTTON_VARIANTS.SECONDARY}
							size={BUTTON_SIZES.SMALL}
							onClick={() => onActionClick?.(foodItem)}
						>
							<Plus className="size-5 bg-primary text-white rounded-full p-1" />
							Track Intake
						</Button>
					</CardAction>
				)}
			</CardContent>
			<CardFooter className="!py-1">
				<span className="text-sm text-gray-600 text-end">
					All Nutritional Facts are approximate it may vary depending on the quantitfy, ingredients, and cooking
					methods.
				</span>
			</CardFooter>
		</Card>
	);
};
