/*
 * This file contains utility functions for calculating vitals.
 */

// Function to calculate BMI
export const calculateBMI = (weight: number, height: number): number => {
	return weight / (height * height);
};

export const getBMIRange = (bmi: number): string => {
	if (bmi < 18.5) return "Underweight";
	if (bmi < 25) return "Normal";
	if (bmi < 30) return "Overweight";
	return "Obese";
};

// Body Fat Percentage based on BMI - Approx method
export const calculateBodyFatPercentageBasedOnBMI = (bmi: number, age: number, gender: string): number => {
	// Male Adults
	if (gender === "Male" && age >= 18) {
		return 1.2 * bmi - 0.23 * age - 16.2;
	}

	// Female Adults
	if (gender === "Female" && age >= 18) {
		return 1.2 * bmi - 0.23 * age - 5.4;
	}

	// Male Children
	if (gender === "Male" && age < 18) {
		return 1.51 * bmi - 0.7 * age - 2.2;
	}

	// Female Children
	if (gender === "Female" && age < 18) {
		return 1.51 * bmi - 0.7 * age + 1.4;
	}

	// Default case
	return 0;
};

// Return Lean Body Mass
export const calculateLeanBodyMass = (weight: number, bodyFatPercentage: number): number => {
	return weight * (1 - bodyFatPercentage);
};

// Function to calculate BMR
// Uses Katch-McArdle Formula with known lean body mass
export const calculateBMR = (leanBodyMass: number): number => {
	return 370 + 21.6 * leanBodyMass;
};

export const ACTIVITY_LEVELS = {
	SEDENTARY: "Sedentary",
	LIGHTLY_ACTIVE: "Lightly Active",
	MODERATELY_ACTIVE: "Moderately Active",
	ACTIVE: "Active",
	VERY_ACTIVE: "Very Active"
};

const PROTEIN_ACTIVITY_LEVEL_MAP = {
	[ACTIVITY_LEVELS.SEDENTARY]: 1.2,
	[ACTIVITY_LEVELS.LIGHTLY_ACTIVE]: 1.375,
	[ACTIVITY_LEVELS.MODERATELY_ACTIVE]: 1.55,
	[ACTIVITY_LEVELS.ACTIVE]: 1.75,
	[ACTIVITY_LEVELS.VERY_ACTIVE]: 2.0
};

// Minimum Protien Required Per day
export const calculateProteinRequired = (leanBodyMass: number, activityLevel: string): number => {
	return leanBodyMass * PROTEIN_ACTIVITY_LEVEL_MAP[activityLevel];
};
