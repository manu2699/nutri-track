import { Bean, Droplets, Flame, Wheat } from "lucide-react";
import { motion } from "motion/react";

export interface DashboardStatsCardProps {
	caloriesConsumed: number;
	caloriesTarget: number;
	proteinConsumed: number;
	proteinTarget: number;
	fatConsumed: number;
	fatTarget: number;
	fiberConsumed: number;
	fiberTarget: number;
	className?: string;
}

export const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
	caloriesConsumed,
	caloriesTarget,
	proteinConsumed,
	proteinTarget,
	fatConsumed,
	fatTarget,
	fiberConsumed,
	fiberTarget,
	className = ""
}) => {
	const calPercentage = Math.min(100, Math.max(0, (caloriesConsumed / (caloriesTarget || 1)) * 100));
	const calRemaining = Math.max(0, Math.round(caloriesTarget - caloriesConsumed));

	const radius = 84;
	const strokeWidth = 8;
	const normalizedRadius = radius - strokeWidth;
	const circumference = normalizedRadius * Math.PI;

	const angle = Math.PI - (calPercentage / 100) * Math.PI;
	const dotX = radius + normalizedRadius * Math.cos(angle);
	const dotY = radius - normalizedRadius * Math.sin(angle);

	return (
		<div
			className={`bg-card text-card-foreground shadow-sm border rounded-xl p-6 flex flex-col gap-8 w-full ${className}`}
		>
			<div className="flex flex-col items-center overflow-hidden">
				<h3 className="text-[15px] font-bold subHeading mb-4 flex items-center gap-1.5">
					<Flame className="size-4 text-blue-500" />
					Calories
				</h3>
				{/* Semi-Circle Progress */}
				<div
					className="relative flex justify-center items-end"
					style={{ width: radius * 2, height: radius + strokeWidth }}
				>
					<svg height={radius + strokeWidth} width={radius * 2} className="absolute bottom-0 overflow-visible">
						<title>Calories Progress</title>
						<path
							d={`M ${strokeWidth} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
							fill="transparent"
							stroke="hsl(var(--accent))"
							strokeWidth={strokeWidth}
							strokeLinecap="round"
						/>
						<motion.path
							initial={{ strokeDashoffset: circumference }}
							animate={{ strokeDashoffset: circumference - (calPercentage / 100) * circumference }}
							transition={{ duration: 1, ease: "easeOut" }}
							d={`M ${strokeWidth} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
							fill="transparent"
							stroke="hsl(var(--primary))"
							strokeWidth={strokeWidth}
							strokeDasharray={circumference}
							strokeLinecap="round"
						/>
						<motion.circle
							initial={{ cx: strokeWidth, cy: radius }}
							animate={{ cx: dotX, cy: dotY }}
							transition={{ duration: 1, ease: "easeOut" }}
							r="6"
							fill="hsl(var(--primary))"
							stroke="white"
							strokeWidth="2"
							className="drop-shadow-sm"
						/>
					</svg>
					<div className="absolute bottom-1 flex flex-col items-center">
						<div className="text-lg font-bold subHeading flex items-baseline gap-1">
							{Math.round(caloriesConsumed)}
							<span className="text-sm font-medium text-muted-foreground font-sans">kcal</span>
						</div>
						<div className="text-xs font-medium text-muted-foreground mt-0.5">Remaining: {calRemaining} kcal</div>
					</div>
				</div>
			</div>

			{/* Macros Section */}
			<div className="flex justify-between items-center px-2 gap-9 mt-2">
				<MacroProgressBar
					label="Protein"
					icon={Bean}
					consumed={proteinConsumed}
					total={proteinTarget}
					colorClass="bg-orange-400"
				/>
				<MacroProgressBar
					label="Fat"
					icon={Droplets}
					consumed={fatConsumed}
					total={fatTarget}
					colorClass="bg-amber-400"
				/>
				<MacroProgressBar
					label="Fiber"
					icon={Wheat}
					consumed={fiberConsumed}
					total={fiberTarget}
					colorClass="bg-emerald-400"
				/>
			</div>
		</div>
	);
};

const MacroProgressBar = ({
	label,
	icon: Icon,
	consumed,
	total,
	colorClass
}: {
	label: string;
	icon: React.ElementType;
	consumed: number;
	total: number;
	colorClass: string;
}) => {
	const percentage = Math.min(100, Math.max(0, (consumed / (total || 1)) * 100));

	return (
		<div className="flex flex-col justify-center items-center w-full">
			<span className="text-[13px] font-bold subHeading mb-2 flex items-center gap-1.5">
				<Icon className={`size-3.5 ${colorClass.replace("bg-", "text-")}`} />
				{label}
			</span>
			<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2 flex justify-start">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${percentage}%` }}
					transition={{ duration: 1, ease: "easeOut" }}
					className={`h-full rounded-full ${colorClass}`}
				/>
			</div>
			<div className="text-sm text-muted-foreground font-medium flex items-center gap-1">
				<span className="text-foreground font-bold text-base">{Math.round(consumed)}</span> / {total}g
			</div>
		</div>
	);
};
