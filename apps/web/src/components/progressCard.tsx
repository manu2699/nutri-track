import { motion } from "motion/react";

interface WaveProgressCardProps {
	percentage: number;
	className?: string;
	children?: React.ReactNode;
}

export const WaveProgressCard: React.FC<WaveProgressCardProps> = ({ percentage, className = "", children }) => {
	const clampedPercentage = Math.max(0, Math.min(100, percentage));

	return (
		<div className={`relative overflow-hidden rounded-xl shadow-md border bg-card w-[200px] h-[200px] ${className}`}>
			{/* Wave Background */}
			<motion.div
				className="absolute inset-0"
				initial={{ y: "100%" }}
				animate={{ y: `${100 - clampedPercentage}%` }}
				transition={{
					duration: 3,
					ease: [0.25, 0.1, 0.25, 1]
				}}
			>
				<div className="relative w-full h-full bg-accent">
					{/** biome-ignore lint/a11y/noSvgWithoutTitle:-- */}
					<svg
						className="absolute top-0 left-0 w-full h-10"
						viewBox="0 0 400 60"
						preserveAspectRatio="none"
						style={{ transform: "translateY(-100%)" }}
					>
						<motion.path
							d="M-200,50 Q-150,30 -100,50 Q-50,70 0,50 Q50,30 100,50 Q150,70 200,50 Q250,30 300,50 Q350,70 400,50 Q450,30 500,50 Q550,70 600,50 Q650,30 700,50 Q750,70 800,50 Q850,30 900,50 Q950,70 1000,50 L1000,100 L-200,100 Z"
							fill="hsl(var(--primary))"
							opacity={0.2}
							animate={{
								x: [-200, 0, 100, -200]
							}}
							transition={{
								duration: 20,
								repeat: Infinity,
								ease: "easeInOut"
							}}
						/>

						{/* Secondary sine wave - different frequency and speed */}
						<motion.path
							d="M-200,45 Q-125,25 -50,45 Q25,65 100,45 Q175,25 250,45 Q325,65 400,45 Q475,25 550,45 Q625,65 700,45 Q775,25 850,45 Q925,65 1000,45 L1000,100 L-200,100 Z"
							fill="hsl(var(--accent))"
							opacity={0.7}
							animate={{
								x: [0, -200, 0]
							}}
							transition={{
								duration: 20,
								repeat: Infinity,
								ease: "easeInOut"
							}}
						/>
					</svg>
				</div>
			</motion.div>

			<div className="absolute inset-0 flex items-center justify-center z-10">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						duration: 0.8,
						delay: 2 * 0.3,
						ease: [0.25, 0.1, 0.25, 1]
					}}
					className="text-center px-4"
				>
					{children}
				</motion.div>
			</div>
		</div>
	);
};
