import { useState } from "react";
import { ChevronRight, Flame, Plus } from "lucide-react";

import { getMeasurementInfo, type MealType } from "@nutri-track/core";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	BUTTON_SIZES,
	BUTTON_VARIANTS,
	Button,
	Drawer,
	DrawerContent,
	DrawerTrigger
} from "@nutri-track/ui";

import { MinimalCalorieRender, MinimalVitals } from "@/components/foodCard";
import { type SaveParams, SearchAndAddFood } from "@/components/organisms/searchAndTrack";
import { TrackingDetails, type UpdateParams } from "@/components/organisms/trackingDetails";
import { mealTypesList } from "@/constants/mealTypes";
import type { UserInterface } from "@/data/database/users";
import type { TrackingResults } from "@/types";

interface ConsumedStats {
	calories?: number;
	protein?: number;
	fat?: number;
}

export interface MealAccordionProps {
	/** Trackings grouped by meal type */
	trackings: Record<string, TrackingResults[]>;

	/** Stats per meal type (calories, protein, etc.) */
	consumedStats?: Record<string, ConsumedStats>;

	/** Enable add/edit/delete functionality */
	editable?: boolean;

	/** Show empty meal sections when true */
	showEmptyMeals?: boolean;

	/** Default expanded meal type */
	defaultExpanded?: string;

	/** Current user (required for editable mode) */
	currentUser?: UserInterface | null;

	/** Callback for saving new tracking (required for editable mode) */
	onSave?: (params: SaveParams) => void;

	/** Callback for updating a tracking (required for editable mode) */
	onUpdate?: (params: UpdateParams) => void;

	/** Callback for deleting a tracking (required for editable mode) */
	onDelete?: (tracking: TrackingResults) => void;

	/** Custom class for container */
	className?: string;
}

export const MealAccordion: React.FC<MealAccordionProps> = ({
	trackings,
	consumedStats = {},
	editable = false,
	showEmptyMeals = false,
	defaultExpanded,
	currentUser,
	onSave,
	onUpdate,
	onDelete,
	className
}) => {
	const [editOpenedFor, setEditOpenedFor] = useState(-1);
	const [isNewEntryOpened, setIsNewEntryOpened] = useState(false);
	const [newEntryMealType, setNewEntryMealType] = useState<MealType | null>(null);

	const handleSave = (params: SaveParams) => {
		onSave?.(params);
		setIsNewEntryOpened(false);
	};

	const handleUpdate = (params: UpdateParams) => {
		onUpdate?.(params);
		setEditOpenedFor(-1);
	};

	const handleDelete = (tracking: TrackingResults) => {
		onDelete?.(tracking);
		setEditOpenedFor(-1);
	};

	const handleOpenNewEntry = (mealType: MealType) => {
		setNewEntryMealType(mealType);
		setIsNewEntryOpened(true);
	};

	return (
		<>
			<Accordion
				type="single"
				collapsible
				className={`w-full px-2 rounded-md shadow-md ${className || ""}`}
				defaultValue={defaultExpanded}
			>
				{Object.entries(mealTypesList).map(([key, mealTypeInfo]) => {
					const mealTrackings = trackings[mealTypeInfo.type] || [];
					const mealStats = consumedStats[mealTypeInfo.type];

					// Skip empty meals if showEmptyMeals is false
					if (!showEmptyMeals && mealTrackings.length === 0) {
						return null;
					}

					const mealCalories = mealStats?.calories ?? mealTrackings.reduce((sum, t) => sum + t.calories, 0);
					// const mealProtein = mealStats?.protein ?? mealTrackings.reduce((sum, t) => sum + (t.protein || 0), 0);
					// const mealFat = mealStats?.fat ?? mealTrackings.reduce((sum, t) => sum + (t.fat || 0), 0);

					return (
						<AccordionItem key={key} value={key}>
							<AccordionTrigger className="hover:no-underline py-3">
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center gap-3">
										<mealTypeInfo.icon className="size-4 text-primary" />
										<span className="text-sm font-medium">{mealTypeInfo.name}</span>
										{mealTrackings.length > 0 && (
											<span className="text-xs text-gray-500">({mealTrackings.length} items)</span>
										)}
									</div>
									<div className="flex items-center gap-1 text-xs">
										<Flame className="size-3" />
										<span className="font-medium">{Math.round(mealCalories)}</span>
										<span className="text-gray-500">kcal</span>
									</div>
								</div>
							</AccordionTrigger>
							<AccordionContent className="pb-3">
								<div className="space-y-2">
									{/* Meal summary */}
									{/* {mealTrackings.length > 0 && (
										<div className="bg-gray-50 rounded-md p-2 mb-2">
											<MinimalVitals
												calories={mealCalories}
												proteins={mealProtein}
												fats={mealFat}
												className="flex !items-center !justify-start gap-4 text-xs"
											/>
										</div>
									)} */}

									{/* Individual food items */}
									<div className="space-y-2">
										{mealTrackings.map((tracking) => (
											<TrackingItem
												key={tracking.id}
												tracking={tracking}
												editable={editable}
												isOpen={editOpenedFor === tracking.id}
												onOpenChange={(isOpen) => setEditOpenedFor(isOpen ? tracking.id : -1)}
												onUpdate={handleUpdate}
												onDelete={() => handleDelete(tracking)}
											/>
										))}
									</div>

									{/* Add button for editable mode */}
									{editable && (
										<Button
											size={BUTTON_SIZES.SMALL}
											className="self-end mr-auto mt-2"
											onClick={() => handleOpenNewEntry(mealTypeInfo.type)}
										>
											<Plus className="size-4" />
											Add
										</Button>
									)}
								</div>
							</AccordionContent>
						</AccordionItem>
					);
				})}
			</Accordion>

			{/* Add new entry drawer (shared across all meal types) */}
			{editable && currentUser && (
				<Drawer open={isNewEntryOpened} onOpenChange={setIsNewEntryOpened}>
					<DrawerContent className="!h-[80vh] p-3">
						{newEntryMealType && (
							<SearchAndAddFood
								currentUser={currentUser}
								mealType={newEntryMealType}
								onSave={handleSave}
								onDiscard={() => setIsNewEntryOpened(false)}
							/>
						)}
					</DrawerContent>
				</Drawer>
			)}
		</>
	);
};

interface TrackingItemProps {
	tracking: TrackingResults;
	editable: boolean;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onUpdate: (params: UpdateParams) => void;
	onDelete: () => void;
}

const TrackingItem: React.FC<TrackingItemProps> = ({
	tracking,
	editable,
	isOpen,
	onOpenChange,
	onUpdate,
	onDelete
}) => {
	return (
		<Drawer open={isOpen} onOpenChange={onOpenChange}>
			<DrawerTrigger asChild>
				<div className="flex justify-between items-center p-1 px-2 bg-white rounded border border-gray-100">
					<div className="flex gap-3 items-center">
						<span className="text-sm font-medium">{tracking.foodDetails?.itemName}</span>
						<span className="text-xs text-gray-500">
							{tracking.consumed} {getMeasurementInfo(tracking.scale).unit}
						</span>
					</div>
					<div className="text-right flex gap-1 items-center">
						<MinimalVitals
							calories={tracking.calories}
							proteins={tracking.protein}
							fats={tracking.fat}
							className="flex !items-end !justify-end gap-2 text-xs"
						/>
						{editable && (
							<Button variant={BUTTON_VARIANTS.GHOST} size={BUTTON_SIZES.SMALL}>
								<ChevronRight className="size-4" />
							</Button>
						)}
					</div>
				</div>
			</DrawerTrigger>
			<DrawerContent className="!h-[80vh]">
				<TrackingDetails
					consumed={tracking.consumed}
					consumedScale={tracking.scale}
					trackingData={tracking}
					foodDetails={tracking.foodDetails}
					onUpdate={onUpdate}
					onDelete={onDelete}
					isEditable={editable}
				/>
			</DrawerContent>
		</Drawer>
	);
};
