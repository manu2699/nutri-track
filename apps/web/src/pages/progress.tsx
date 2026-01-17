import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
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

import { getFoodItem } from "@nutri-track/core";
import {
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
import { MealAccordion } from "@/components/MealAccordion";
import { Navigation } from "@/components/navigation";
import type { ProgressData, TrackingDataInterface } from "@/data/database/trackings";
import { useDataStore } from "@/data/store";
import type { ProgressTimeFrame, TrackingResults } from "@/types";
import { getMonthName } from "@/utils";

const timeFrameOptions = [
	{ label: "Month to Date", value: "month-to-date" },
	{ label: "Past Month", value: "past-month" },
	{ label: "Past Week", value: "past-week" },
	{ label: "Custom", value: "custom" }
] as const;

const transformToTrackingResults = (trackingData: TrackingDataInterface[]): Record<string, TrackingResults[]> => {
	return trackingData.reduce(
		(acc, tracking) => {
			if (!acc[tracking.meal_type]) {
				acc[tracking.meal_type] = [];
			}
			acc[tracking.meal_type].push({
				...tracking,
				foodDetails: getFoodItem(tracking.food_id)
			});
			return acc;
		},
		{} as Record<string, TrackingResults[]>
	);
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

	const selectedDayData = selectedDate ? progressData.find((item) => item.date === selectedDate) : undefined;

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
				<h3 className="font-medium text-sm">Tap on any chart item</h3>
				<p className="text-xs text-gray-500 mt-1">Select a day from the charts above to see what you consumed</p>
			</div>
		</div>
	</Card>
);

const DailyConsumptionDetails = ({
	selectedDate,
	selectedDayData,
	onClear
}: {
	selectedDate: string;
	selectedDayData: ProgressData | undefined;
	onClear: () => void;
}) => {
	const transformedTrackings = transformToTrackingResults(selectedDayData?.daily_trackings || []);

	return (
		<Card className="p-3">
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

			<div className="">
				<MinimalVitals
					calories={selectedDayData?.total_calories}
					proteins={selectedDayData?.total_protein}
					fats={selectedDayData?.total_fat}
					className="flex !items-center !justify-center gap-4"
				/>
			</div>

			<MealAccordion trackings={transformedTrackings} editable={false} showEmptyMeals={false} className="shadow-none" />
		</Card>
	);
};

const CustomTooltip = ({ payload }: { payload: any[] }) => {
	const { date, total_calories: totalCalories } = payload?.[0]?.payload || {};
	return (
		<div className="bg-white p-2 rounded shadow text-sm">
			<p className="text-grey-500 text-xs">{`${getMonthName(new Date(date))} ${new Date(date).getDate()}`}</p>
			<p className="text-grey-500">{totalCalories} cal</p>
		</div>
	);
};
