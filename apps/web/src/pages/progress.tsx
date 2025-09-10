import { useEffect, useState } from "react";
import { Cookie, Flame, MoonStar, Sun, Sunrise } from "lucide-react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts";

import { getFoodItem, MealTypeEnums, MealTypeLabelEnums } from "@nutri-track/core";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	BUTTON_VARIANTS,
	Button,
	Card,
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@nutri-track/ui";

import { CustomDashedBar } from "@/components/dashedBar";
import { MinimalVitals } from "@/components/foodCard";
import { Navigation } from "@/components/navigation";
import type { TrackingDataInterface } from "@/data/database/trackings";
import { useDataStore } from "@/data/store";
import type { ProgressTimeFrame } from "@/types";
import { getMonthName } from "@/utils";

const timeFrameOptions = [
	{ label: "Month to Date", value: "month-to-date" },
	{ label: "Past Month", value: "past-month" },
	{ label: "Past Week", value: "past-week" },
	{ label: "Custom", value: "custom" }
] as const;

const mealTypesList = {
	[MealTypeLabelEnums.breakfast]: {
		name: MealTypeLabelEnums.breakfast,
		type: MealTypeEnums.breakfast,
		icon: Sunrise
	},
	[MealTypeLabelEnums.lunch]: {
		name: MealTypeLabelEnums.lunch,
		type: MealTypeEnums.lunch,
		icon: Sun
	},
	[MealTypeLabelEnums.snacks]: {
		name: MealTypeLabelEnums.snacks,
		type: MealTypeEnums.snacks,
		icon: Cookie
	},
	[MealTypeLabelEnums.dinner]: {
		name: MealTypeLabelEnums.dinner,
		type: MealTypeEnums.dinner,
		icon: MoonStar
	}
};

export const ProgressPage = () => {
	const progressData = useDataStore((state) => state.progressData);
	const selectedTimeFrame = useDataStore((state) => state.selectedTimeFrame);

	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date }>({
		start: new Date(),
		end: new Date()
	});

	useEffect(() => {
		useDataStore.getState().getProgressData(selectedTimeFrame, customDateRange);
	}, [selectedTimeFrame, customDateRange]);

	const handleTimeFrameChange = (value: string) => {
		if (value === "custom") {
			// TODO: Open date range picker and get dates from user
			// Mock code
			const currentDate = new Date();
			const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
			const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
			setCustomDateRange({ start: monthStart, end: monthEnd });
		}
		useDataStore.getState().setSelectedTimeFrame(value as ProgressTimeFrame);
	};

	const handleChartClick = (data: any) => {
		if (data && data.activeIndex !== undefined && progressData[data.activeIndex]) {
			const clickedData = progressData[data.activeIndex];
			setSelectedDate(clickedData.date);
		}
	};

	const selectedDayData = selectedDate ? progressData.find((item) => item.date === selectedDate) : null;

	// Group trackings by meal type for selected day
	const groupedTrackings =
		selectedDayData?.daily_trackings.reduce(
			(acc, tracking) => {
				if (!acc[tracking.meal_type]) {
					acc[tracking.meal_type] = [];
				}
				acc[tracking.meal_type].push(tracking);
				return acc;
			},
			{} as Record<string, TrackingDataInterface[]>
		) || {};

	return (
		<div className="page flex flex-col p-4 justify-between gap-6">
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-medium">Progress</h2>
					<Select value={selectedTimeFrame} onValueChange={handleTimeFrameChange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{timeFrameOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<Carousel
					opts={{
						align: "center",
						loop: true
					}}
					className="w-full"
				>
					<CarouselContent>
						<CarouselItem>
							<h3 className="text-sm font-medium mb-4">Calorie Consumption</h3>
							<div className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={progressData} onClick={handleChartClick}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											dataKey="date"
											tick={{ fontSize: 9 }}
											tickFormatter={(value) => `${getMonthName(new Date(value))} ${new Date(value).getDate()}`}
											interval={"equidistantPreserveStart"}
										/>
										<YAxis tick={{ fontSize: 11 }} />
										<Tooltip content={CustomTooltip} />
										<Bar dataKey="total_calories" name="Calories" shape={<CustomDashedBar />} />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CarouselItem>
						<CarouselItem>
							<h3 className="text-sm font-medium mb-4">Other Vitals</h3>
							<div className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart data={progressData} onClick={handleChartClick}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											dataKey="date"
											tick={{ fontSize: 9 }}
											tickFormatter={(value) => `${getMonthName(new Date(value))} ${new Date(value).getDate()}`}
											interval={"equidistantPreserveStart"}
										/>
										<YAxis tick={{ fontSize: 11 }} />
										<Tooltip />
										<Legend />
										<Area
											type="monotone"
											dataKey="total_protein"
											stackId="1"
											stroke="#8884d8"
											fill="#8884d8"
											name="Protein"
										/>
										<Area type="monotone" dataKey="total_fat" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Fat" />
										<Area
											type="monotone"
											dataKey="total_fiber"
											stackId="1"
											stroke="#ffc658"
											fill="#ffc658"
											name="Fiber"
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</CarouselItem>
					</CarouselContent>
					<div className="mt-2 flex justify-between">
						<div className="flex gap-2">
							<CarouselPrevious />
							<CarouselNext />
						</div>
						<CarouselDots />
					</div>
				</Carousel>

				<div className="space-y-4">
					{!selectedDate ? (
						<EmptyState />
					) : (
						<DailyConsumptionDetails
							selectedDate={selectedDate}
							selectedDayData={selectedDayData}
							groupedTrackings={groupedTrackings}
							onClear={() => setSelectedDate(null)}
						/>
					)}
				</div>
			</div>

			<Navigation />
		</div>
	);
};

const EmptyState = () => (
	<Card className="p-6 text-center">
		<div className="flex flex-col items-center gap-3">
			<div className="p-3 rounded-full bg-primary/10">
				<Flame className="size-6 text-primary" />
			</div>
			<div>
				<h3 className="font-medium text-sm">Click on any chart item</h3>
				<p className="text-xs text-gray-500 mt-1">Select a day from the charts above to see what you consumed</p>
			</div>
		</div>
	</Card>
);

const DailyConsumptionDetails = ({
	selectedDate,
	selectedDayData,
	groupedTrackings,
	onClear
}: {
	selectedDate: string;
	selectedDayData: any;
	groupedTrackings: Record<string, TrackingDataInterface[]>;
	onClear: () => void;
}) => (
	<Card className="p-4">
		<div className="flex items-center justify-between gap-2">
			<div>
				<h3 className="font-medium text-sm">
					Consumed on {getMonthName(new Date(selectedDate))} {new Date(selectedDate).getDate()}
				</h3>
				<p className="text-xs text-gray-500">Tap to view details by meal</p>
			</div>
			<Button onClick={onClear} className="text-xs text-primary hover:underline" variant={BUTTON_VARIANTS.GHOST}>
				Clear
			</Button>
		</div>

		{/* Daily summary vitals */}
		<div className="">
			<MinimalVitals
				calories={selectedDayData?.total_calories}
				proteins={selectedDayData?.total_protein}
				fats={selectedDayData?.total_fat}
				className="flex !items-center !justify-center gap-4"
			/>
		</div>

		{/* Meal-wise breakdown */}
		<Accordion type="single" collapsible className="w-full">
			{Object.entries(mealTypesList).map(([key, mealTypeInfo]) => {
				const mealTrackings = groupedTrackings[mealTypeInfo.type] || [];
				if (mealTrackings.length === 0) return null;

				const mealCalories = mealTrackings.reduce((sum, tracking) => sum + tracking.calories, 0);
				const mealProtein = mealTrackings.reduce((sum, tracking) => sum + (tracking.protein || 0), 0);
				const mealFat = mealTrackings.reduce((sum, tracking) => sum + (tracking.fat || 0), 0);
				// const mealFiber = mealTrackings.reduce((sum, tracking) => sum + (tracking.fiber || 0), 0);

				return (
					<AccordionItem key={key} value={key} className="border-b border-gray-200">
						<AccordionTrigger className="hover:no-underline py-3">
							<div className="flex items-center justify-between w-full">
								<div className="flex items-center gap-3">
									<mealTypeInfo.icon className="size-4 text-primary" />
									<span className="text-sm font-medium">{mealTypeInfo.name}</span>
									<span className="text-xs text-gray-500">({mealTrackings.length} items)</span>
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
								<div className="bg-gray-50 rounded-md p-2 mb-2">
									<MinimalVitals
										calories={mealCalories}
										proteins={mealProtein}
										fats={mealFat}
										className="flex !items-center !justify-start gap-4 text-xs"
									/>
									{/*<div className="flex items-center gap-4 mt-2 text-xs">
										<div className="flex items-center gap-1">
											<Leaf className="size-3 text-gray-500" />
											<span className="text-gray-600">Fiber:</span>
											<span className="font-medium">{Math.round(mealFiber)}g</span>
										</div>
									</div>*/}
								</div>

								{/* Individual food items */}
								<div className="space-y-2">
									{mealTrackings.map((tracking) => {
										const foodDetails = getFoodItem(tracking.food_id);
										if (!foodDetails) return null;

										return (
											<div
												key={tracking.id}
												className="flex justify-between items-start p-2 bg-white rounded border border-gray-100"
											>
												<div className="flex gap-3 items-center">
													<span className="text-sm font-medium">{foodDetails.itemName}</span>
													<span className="text-xs text-gray-500">
														{tracking.consumed} {tracking.scale}
													</span>
												</div>
												<div className="text-right">
													<MinimalVitals
														calories={tracking.calories}
														proteins={tracking.protein}
														fats={tracking.fat}
														className="flex !items-end !justify-end gap-2 text-xs"
													/>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				);
			})}
		</Accordion>
	</Card>
);

const CustomTooltip = ({ payload }: { payload: any[] }) => {
	const { date, total_calories: totalCalories } = payload?.[0]?.payload || {};
	return (
		<div className="bg-white p-2 rounded shadow text-sm">
			<p className="text-grey-500 text-xs">{`${getMonthName(new Date(date))} ${new Date(date).getDate()}`}</p>
			<p className="text-grey-500">{totalCalories} cal</p>
		</div>
	);
};
