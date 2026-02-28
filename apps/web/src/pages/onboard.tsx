import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { ActivityLevelEnum, calculateBMI, calculateBodyFateBasedOnBMI, regions } from "@nutri-track/core";
import {
	Button,
	Input,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@nutri-track/ui";

import type { UserInterface } from "@/data/database/users";
import { useDataStore } from "@/data/store";

type FormField = {
	id: string;
	label: string;
	placeholder?: string;
	type: string;
	options?: { label: string; value: string }[];
	required: boolean;
	hint?: string;
};

const formFields = [
	{
		id: "name",
		label: "Your sweet name?",
		placeholder: "Heisenberg",
		type: "text",
		required: true,
		hint: "Knowing your name helps us personalize your experience."
	},
	{
		id: "age",
		label: "Years on Earth?",
		placeholder: "28",
		type: "number",
		required: true,
		hint: "Your age helps us to calculate your daily calorie needs, bmi, and other nutritional factors."
	},
	{
		id: "gender",
		label: "What's your gender?",
		type: "radio",
		options: [
			{ label: "Male", value: "male" },
			{ label: "Female", value: "female" }
		],
		required: true,
		hint: "Gender can influence nutritional requirements."
	},
	{
		id: "email",
		label: "Wanna stay in the loop? Share your email?",
		placeholder: "heisenberg@nflix.com",
		type: "email",
		required: true,
		hint: "We'll use your email to identify & backup your data."
	},
	{
		id: "weight",
		label: "Give your grounded presence in kilograms",
		placeholder: "70",
		type: "number",
		required: true,
		hint: "Your weight is crucial for calculating your caloric and macronutrient needs."
	},
	{
		id: "height",
		label: "How many centimeters of coolness?",
		placeholder: "175",
		type: "number",
		required: true,
		hint: "Your height, along with weight, helps us determine your Body Mass Index (BMI) & Basal Metabolic Rate (BMR)."
	},
	{
		id: "activityLevel",
		label: "How active are you?",
		type: "radio",
		options: [
			{ label: "Sedentary", value: ActivityLevelEnum.Sedentary },
			{ label: "Lightly Active", value: ActivityLevelEnum.LightlyActive },
			{ label: "Moderately Active", value: ActivityLevelEnum.ModeratelyActive },
			{ label: "Active", value: ActivityLevelEnum.Active },
			{ label: "Very Active / Athlete", value: ActivityLevelEnum.VeryActive }
		],
		required: false,
		hint: "Your activity level helps us provide your daily calorie & protein needs."
	},
	{
		id: "bmi",
		label: "What is your Body Mass Index (BMI)?",
		placeholder: "25",
		type: "number",
		required: true,
		hint: "Your BMI is crucial for calculating your caloric and macronutrient needs. We have calculated approximate BMI using weight & height you have provided. If you know your BMI, please correct it here."
	},
	{
		id: "bodyFat",
		label: "What is your body fat in Kg?",
		placeholder: "20",
		type: "number",
		required: true,
		hint: "Your body fat(kg) is crucial for calculating your caloric and macronutrient needs. We have calculated approximate body fat percentage using BMI you have provided. If you know your body fat percentage, please correct it here."
	},
	{
		id: "region",
		label: "What region do you live in?",
		type: "select",
		options: regions.map((region) => ({ label: region, value: region })),
		required: true,
		placeholder: "Select your region",
		hint: "We'll provide you some frequent recommendations based on your region for quick access."
	}
];

export const OnBoardFromPage = () => {
	const navigate = useNavigate();

	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		name: "",
		age: "" as number | string,
		gender: "",
		email: "",
		weight: "" as number | string,
		height: "" as number | string,
		bodyFat: "" as number | string,
		region: "",
		bmi: "" as number | string,
		activityLevel: ActivityLevelEnum.Sedentary as string
	});

	const handleChange = (id: string, value: string | number | boolean) => {
		const formField = formFields.find((field) => field.id === id);
		if (formField?.type === "number") {
			value = value === "" ? "" : Number(value);
		}
		setFormData({ ...formData, [id]: value });
		postCalculations(id, value);
	};

	const postCalculations = (id: string, value: string | number | boolean) => {
		if (id === "height") {
			setFormData((prev) => ({
				...prev,
				bmi: calculateBMI(Number(prev.weight) || 0, Number(value) || 0),
				bodyFat: calculateBodyFateBasedOnBMI(
					calculateBMI(Number(prev.weight) || 0, Number(value) || 0),
					Number(prev.age) || 0,
					prev.gender
				)
			}));
			return;
		}
		if (id === "bmi") {
			setFormData((prev) => ({
				...prev,
				bodyFat: calculateBodyFateBasedOnBMI(Number(value) || 0, Number(prev.age) || 0, prev.gender)
			}));
			return;
		}
	};

	const canGoNext = useMemo(
		() =>
			formFields[currentStep].required ? Boolean(formData[formFields[currentStep].id as keyof typeof formData]) : true,
		[currentStep, formData]
	);

	const handleStepChange = (step: number) => {
		setCurrentStep(step);
	};

	const handleSubmit = () => {
		const userController = useDataStore.getState().userController;
		if (!userController) throw new Error("User controller is not initialized");
		userController
			.createUser({
				name: formData.name,
				age: Number(formData.age),
				email: formData.email,
				gender: formData.gender,
				weight: Number(formData.weight),
				height: Number(formData.height),
				body_fat: Number(formData.bodyFat),
				bmi: Number(formData.bmi),
				activity_level: formData.activityLevel
			} as UserInterface)
			.then((user) => {
				useDataStore.getState().setCurrentUser(user);
				navigate("/home");
			});
	};

	return (
		<div className="page flex flex-col justify-center items-center">
			<p className="text-2xl heading font-bold text-primary">Get Started</p>
			<div className="flex flex-col items-center w-full px-4 mt-8">
				<StepperForm
					onStepChange={handleStepChange}
					canGoNext={canGoNext}
					canGoPrev={true}
					submitText="Proceed"
					onSubmit={handleSubmit}
				>
					{formFields.map((field) => (
						<div key={field.id} className="flex flex-col gap-2">
							<label htmlFor={field.id} className="font-semibold">
								{field.label}
							</label>
							<FieldRenderer field={field} formData={formData} onChange={(id, value) => handleChange(id, value)} />
							{field.hint && <p className="text-sm text-gray-500">{field.hint}</p>}
						</div>
					))}
				</StepperForm>
			</div>
		</div>
	);
};

const FieldRenderer = ({
	field,
	formData,
	onChange
}: {
	field: FormField;
	formData: Record<string, string | number | boolean>;
	onChange: (id: string, value: string | boolean | number) => void;
}) => {
	switch (field.type) {
		case "radio": {
			return (
				<RadioGroup value={formData[field.id] as string} onValueChange={(val: string) => onChange(field.id, val)}>
					{field.options?.map((option) => (
						<div className="flex items-center space-x-2" key={option.value}>
							<RadioGroupItem key={option.value} value={option.value} />
							<label htmlFor={option.value}>{option.label}</label>
						</div>
					))}
				</RadioGroup>
			);
		}
		case "select": {
			return (
				<Select value={formData[field.id] as string} onValueChange={(val: string) => onChange(field.id, val)}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder={field.placeholder} />
					</SelectTrigger>
					<SelectContent className="max-h-52">
						{field.options?.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
		}
		case "text":
		case "number":
		case "email":
		case "password":
		case "date": {
			return (
				<Input
					id={field.id}
					type={field.type}
					placeholder={field.placeholder}
					value={formData[field.id] as number | string}
					onChange={(e) => onChange(field.id, e.target.value)}
					required={field.required}
					className="w-full max-w-md"
				/>
			);
		}
	}
};

type StepperFormProps = {
	children: React.ReactNode[];
	onStepChange?: (step: number) => void;
	controlsClassName?: string;
	canGoNext?: boolean;
	canGoPrev?: boolean;
	submitText?: string;
	onSubmit?: () => void;
};

const StepperForm = ({
	children,
	onStepChange,
	controlsClassName = "mt-6 flex justify-between self-end",
	canGoNext = true,
	canGoPrev = true,
	submitText = "",
	onSubmit
}: StepperFormProps) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [direction, setDirection] = useState(0); // -1 for backward, 1 for forward
	const containerRef = useRef<HTMLDivElement>(null);
	const touchStartY = useRef(0);

	const goToNextStep = useCallback(() => {
		if (currentStep < children.length - 1 && canGoNext) {
			setDirection(1);
			const nextStep = currentStep + 1;
			setCurrentStep(nextStep);
			onStepChange?.(nextStep);
		}
	}, [currentStep, children.length, onStepChange, canGoNext]);

	const goToPrevStep = useCallback(() => {
		if (currentStep > 0 && canGoPrev) {
			setDirection(-1);
			const prevStep = currentStep - 1;
			setCurrentStep(prevStep);
			onStepChange?.(prevStep);
		}
	}, [currentStep, onStepChange, canGoPrev]);

	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartY.current = e.touches[0].clientY;
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		const touchEndY = e.changedTouches[0].clientY;
		const deltaY = touchEndY - touchStartY.current;

		if (deltaY < -50) {
			goToNextStep(); // swipe up
		} else if (deltaY > 50) {
			goToPrevStep(); // swipe down
		}
	};

	return (
		<div
			className="w-full max-w-sm relative overflow-hidden"
			ref={containerRef}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			<div className="w-full h-[250px] relative">
				<AnimatePresence initial={false} custom={direction}>
					<motion.div
						key={currentStep}
						custom={direction}
						initial={{
							y: direction > 0 ? 200 : -200,
							opacity: 0
						}}
						animate={{ y: 0, opacity: 1 }}
						exit={{
							y: direction > 0 ? -200 : 200,
							opacity: 0
						}}
						transition={{
							y: { type: "spring", stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 }
						}}
						className="absolute w-full h-[200px] flex flex-col gap-2 justify-center overscroll-contain touch-pan-x"
					>
						{children[currentStep]}
					</motion.div>
				</AnimatePresence>
			</div>

			<div className={controlsClassName}>
				<Button
					onClick={goToPrevStep}
					disabled={currentStep === 0 || !canGoPrev}
					variant="outline"
					size="icon"
					className="rounded-full"
				>
					<ChevronUp />
				</Button>
				{submitText && currentStep === children.length - 1 ? (
					<Button onClick={onSubmit} disabled={!canGoNext} className="py-1 px-4">
						{submitText}
					</Button>
				) : (
					<Button onClick={goToNextStep} disabled={!canGoNext} variant="outline" size="icon" className="rounded-full">
						<ChevronDown />
					</Button>
				)}
			</div>
		</div>
	);
};
