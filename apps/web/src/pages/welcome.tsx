import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowBigRight } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@nutri-track/ui";

import { useDataStore } from "@/data/store";

import Meal from "@/assets/meal.svg?react";

export const WelcomePage = () => {
	const navigate = useNavigate();
	const currentUser = useDataStore((s) => s.currentUser);

	useEffect(() => {
		if (currentUser) {
			navigate("/home");
		}
	}, [currentUser, navigate]);

	return (
		<div className="page flex flex-col justify-between items-center">
			<h1 className="text-4xl font-bold text-primary mt-16">NUTRI - TRACK</h1>
			<div className="flex flex-col items-center">
				<Meal />
				<p className="subHeading text-base text-secondary">Track your nutrients with ease.</p>
			</div>
			<Button className="w-max self-end heading text-base mb-6 mr-4" onClick={() => navigate("/onboard")}>
				Get Started
				<motion.div
					animate={{
						x: [-2, 5, -2],
						transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
					}}
				>
					<ArrowBigRight />
				</motion.div>
			</Button>
		</div>
	);
};
