/*
 * This file contains utility functions for calculating vitals.
 */

// Function to calculate BMI
export const calculateBMI = (weight: number, height: number): number => {
	return Number((weight / Math.pow(height / 100, 2)).toFixed(2));
};

export const getBMIRange = (bmi: number): string => {
	if (bmi < 18.5) return "Underweight";
	if (bmi < 25) return "Normal";
	if (bmi < 30) return "Overweight";
	return "Obese";
};

// Body Fat Percentage based on BMI - Approx method
export const calculateBodyFateBasedOnBMI = (bmi: number, age: number, gender: string): number => {
	let bodyFat = 0;

	if (gender.toLocaleLowerCase() === "male" && age >= 18) {
		// Male Adults
		bodyFat = 1.2 * bmi + 0.23 * age - 16.2;
	} else if (gender.toLocaleLowerCase() === "female" && age >= 18) {
		// Female Adults
		bodyFat = 1.2 * bmi + 0.23 * age - 5.4;
	} else if (gender.toLocaleLowerCase() === "male" && age < 18) {
		// Male Children
		bodyFat = 1.51 * bmi - 0.7 * age - 2.2;
	} else if (gender.toLocaleLowerCase() === "female" && age < 18) {
		// Female Children
		bodyFat = 1.51 * bmi - 0.7 * age + 1.4;
	}

	return Number(bodyFat.toFixed(2));
};

// Return Lean Body Mass
export const calculateLeanBodyMass = (weight: number, bodyFat: number): number => {
	return weight * (1 - bodyFat / 100);
};

// Function to calculate BMR
// Uses Katch-McArdle Formula with known lean body mass
export const calculateBMR = (leanBodyMass: number): number => {
	return Math.round(370 + 21.6 * leanBodyMass);
};

export type ActivityLevelTypes = "Sedentary" | "Lightly Active" | "Moderately Active" | "Active" | "Very Active";
export enum ActivityLevelEnum {
	Sedentary = "Sedentary",
	LightlyActive = "Lightly Active",
	ModeratelyActive = "Moderately Active",
	Active = "Active",
	VeryActive = "Very Active"
}

const PROTEIN_ACTIVITY_LEVEL_MAP = {
	[ActivityLevelEnum.Sedentary]: 1.2,
	[ActivityLevelEnum.LightlyActive]: 1.375,
	[ActivityLevelEnum.ModeratelyActive]: 1.55,
	[ActivityLevelEnum.Active]: 1.75,
	[ActivityLevelEnum.VeryActive]: 2.0
};

// Minimum Protien Required Per day
export const calculateProteinRequired = (leanBodyMass: number, activityLevel: ActivityLevelTypes): number => {
	return Math.round(leanBodyMass * PROTEIN_ACTIVITY_LEVEL_MAP[activityLevel]);
};
