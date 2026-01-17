import { useCallback, useEffect, useState } from "react";
import { Check, Trash } from "lucide-react";

import { calculateIntakeFacts, type FoodItem, getMeasurementInfo } from "@nutri-track/core";
import { BUTTON_SIZES, BUTTON_VARIANTS, Button, debounce, Input } from "@nutri-track/ui";

import { NutriFactCard } from "@/components/nutriFactCard";
import type { TrackingResults } from "@/types";

export type UpdateParams = {
	eatenInput: number;
	consumedInfo: FoodItem;
	trackingData: TrackingResults;
};

interface TrackingDetailsProps {
	consumed: number;
	consumedScale: string;
	trackingData: TrackingResults;
	foodDetails: FoodItem | null;
	onUpdate: (params: UpdateParams) => void;
	onDelete: () => void;
	isEditable?: boolean;
}

export const TrackingDetails: React.FC<TrackingDetailsProps> = ({
	consumed,
	consumedScale,
	foodDetails,
	trackingData,
	onUpdate,
	onDelete,
	isEditable = false
}) => {
	const [eatenInput, setEatenInput] = useState<number>(() => consumed);
	const [consumedInfo, setConsumedInfo] = useState<FoodItem | null>(null);

	useEffect(() => {
		if (foodDetails) {
			setConsumedInfo(() => calculateIntakeFacts(foodDetails, consumed));
		}
	}, [foodDetails, consumed]);

	const debounceCalculateIntakeFacts = useCallback(
		debounce((item: FoodItem, value: number) => {
			setConsumedInfo(() => calculateIntakeFacts(item, value));
		}, 300),
		[]
	);

	const handleChangeEaten = useCallback(
		(value: number) => {
			setEatenInput(value);
			if (foodDetails && value) {
				debounceCalculateIntakeFacts(foodDetails, value);
			}
		},
		[foodDetails, debounceCalculateIntakeFacts]
	);

	const handleSave = () => {
		consumedInfo && onUpdate({ eatenInput, consumedInfo, trackingData });
	};

	return (
		<div className="p-2">
			{consumedInfo && (
				<NutriFactCard
					className="border-0 p-0"
					foodItem={consumedInfo}
					consumedQuantity={`${eatenInput} ${getMeasurementInfo(consumedInfo.calorieMeasurement).unit}`}
					description={
						isEditable ? (
							<>
								<Input
									value={eatenInput}
									type="number"
									onChange={(e) => handleChangeEaten(parseInt(e.target.value) || 0)}
									placeholder={`How much did you had?`}
									className="w-full bg-transparent"
									suffix={consumedScale}
								/>
								<div className="flex justify-end gap-4 my-2">
									<Button
										variant={BUTTON_VARIANTS.OUTLINE}
										size={BUTTON_SIZES.SMALL}
										onClick={onDelete}
										className="!p-2"
									>
										<Trash className="size-4 !text-destructive" />
										Delete
									</Button>
									<Button size={BUTTON_SIZES.SMALL} onClick={handleSave} className="!p-2">
										<Check className="size-4" />
										Save
									</Button>
								</div>
							</>
						) : null
					}
				/>
			)}
		</div>
	);
};
