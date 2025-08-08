import { useState } from "react";

import { BADGE_VARIANTS, Badge, BUTTON_SIZES, Button, Input } from "@nutri-track/ui";

import { UserHeader } from "@/components/userHeader";
import { useDataStore } from "@/data/store";
import { getMealType } from "@/utils";

const frequentFoods = ["Pancakes", "Eggs", "Oatmeal", "Chicken", "Beef", "Fish", "Vegetables", "Fruits"];

export const HomePage = () => {
	const currentUser = useDataStore((s) => s.currentUser);
	const [eaten, setEaten] = useState("");
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEaten(e.target.value);
	};
	const [mealType] = useState(getMealType(new Date()));

	return (
		<div className="page flex flex-col !p-0">
			{currentUser?.id ? <UserHeader name={currentUser.name} id={currentUser.id} /> : null}
			<div className="flex flex-col p-4">
				<div className="flex flex-col justify-center items-center gap-5">
					<h2 className="text-xl subHeading text-center font-bold text-secondary mt-3">Had your {mealType}?</h2>
					{/* TODO : need to implement suggestion based on user input */}
					<Input
						type="text"
						placeholder="Whats that?"
						value={eaten}
						onChange={handleChange}
						className="w-[80%] max-w-md"
					/>
					{!eaten ? (
						<div className="flex items-center flex-wrap gap-3">
							{frequentFoods.map((food) => (
								<Badge key={food} onClick={() => setEaten(food)} variant={BADGE_VARIANTS.SECONDARY}>
									{food}
								</Badge>
							))}
						</div>
					) : (
						<div className="flex flex-col bg-secondary px-4 py-2  rounded-md">
							<p className="font-bold">
								You have eaten {eaten} for {mealType}
							</p>
							<p className="text-sm">Nutri Breakdown</p>
							<p className="text-sm">Calories: 200</p>
							<p className="text-sm">Protein: 20g</p>
							<p className="text-sm">Fat: 10g</p>
							<p className="text-sm">Carbs: 30g</p>
							<Button size={BUTTON_SIZES.SMALL} variant={BADGE_VARIANTS.DEFAULT} className="w-max self-end">
								Add
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
