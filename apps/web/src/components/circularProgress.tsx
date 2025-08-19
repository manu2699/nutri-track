/** biome-ignore-all lint/a11y/noSvgWithoutTitle: -- */
import { motion } from "motion/react";

export const CircularProgress = ({
	percentage,
	centerText
}: {
	percentage: number;
	centerText?: string | React.ReactNode;
}) => {
	const radius = 36;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	return (
		<div className="relative size-32">
			<motion.svg
				className="w-full h-full transform -rotate-90"
				viewBox="0 0 80 80"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
			>
				{/* Background circle */}
				<circle
					cx="40"
					cy="40"
					r={radius}
					stroke="hsl(var(--muted))"
					strokeWidth="8"
					fill="transparent"
					className="opacity-100"
				/>
				{/* Progress circle */}
				<motion.circle
					cx="40"
					cy="40"
					r={radius}
					stroke="hsl(var(--primary))"
					strokeWidth="8"
					fill="transparent"
					strokeLinecap="round"
					strokeDasharray={circumference}
					initial={{ strokeDashoffset: circumference }}
					animate={{ strokeDashoffset }}
					transition={{
						duration: 1.2,
						ease: "easeInOut",
						delay: 0.2
					}}
				/>
			</motion.svg>
			{/* Center content */}
			<motion.div
				className="absolute inset-0 flex items-center justify-center"
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
			>
				<motion.div
					className="text-center"
					initial={{ y: 10 }}
					animate={{ y: 0 }}
					transition={{ duration: 0.3, delay: 0.8 }}
				>
					<motion.span
						className="text-sm font-bold text-gray-700"
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.3, delay: 1 }}
					>
						{centerText || `${Math.round(percentage)}%`}
					</motion.span>
				</motion.div>
			</motion.div>
		</div>
	);
};
