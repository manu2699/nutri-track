import { useEffect, useState } from "react";
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

// import { getFoodItem } from "@nutri-track/core";
import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	//  Card, Drawer,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@nutri-track/ui";

import { CustomDashedBar } from "@/components/dashedBar";
import { Navigation } from "@/components/navigation";
// import type { TrackingDataInterface } from "@/data/database/trackings";
import { useDataStore } from "@/data/store";
import type { ProgressTimeFrame } from "@/types";
import { getMonthName } from "@/utils";

const timeFrameOptions = [
	{ label: "Month to Date", value: "month-to-date" },
	{ label: "Past Month", value: "past-month" },
	{ label: "Past Week", value: "past-week" },
	{ label: "Custom", value: "custom" }
] as const;

export const ProgressPage = () => {
	const progressData = useDataStore((state) => state.progressData);
	const selectedTimeFrame = useDataStore((state) => state.selectedTimeFrame);

	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

	const selectedDayData = selectedDate ? progressData.find((item) => item.date === selectedDate) : null;

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
									<BarChart
										data={progressData}
										onClick={(data) => {
											console.log("click  :: ", data, progressData[Number(data.activeIndex)]);
										}}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											dataKey="date"
											tick={{ fontSize: 9 }}
											tickFormatter={(value) => `${getMonthName(new Date(value))} ${new Date(value).getDate()}`}
											interval={"equidistantPreserveStart"}
										/>
										<YAxis tick={{ fontSize: 11 }} />
										<Tooltip content={CustomTooltip} />
										{/* Bar with shape slightly border radius and having dotted pattern inside it */}
										<Bar dataKey="total_calories" name="Calories" shape={<CustomDashedBar />} />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CarouselItem>
						<CarouselItem>
							<h3 className="text-sm font-medium mb-4">Other Vitals</h3>
							<div className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart data={progressData}>
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
			</div>

			<Navigation />
			{/* 
			<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
				<div className="p-4">
					<h3 className="text-lg font-medium mb-4">Consumed on {selectedDate}</h3>
					<div className="space-y-4">
						{selectedDayData?.daily_trackings.map((tracking: TrackingDataInterface) => {
							const foodDetails = getFoodItem(tracking.food_id);
							if (!foodDetails) return null;
							return (
								<Card key={tracking.id} className="p-3">
									<div className="flex justify-between">
										<div>
											<p className="font-medium">{foodDetails.itemName}</p>
											<p className="text-sm text-neutral-500">
												{tracking.consumed} {foodDetails.calorieMeasurement}
											</p>
										</div>
										<div className="text-right">
											<p className="font-medium">{tracking.calories} cal</p>
											<p className="text-sm text-neutral-500">{tracking.meal_type}</p>
										</div>
									</div>
								</Card>
							);
						})}
					</div>
				</div>
			</Drawer> */}
		</div>
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
