import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button, Input, RadioGroup, RadioGroupItem } from "@nutri-track/ui";

import type { UserInterface } from "../data/database/users";
import { useDataStore } from "../data/store";

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
		hint: "Your age helps us provide age-appropriate nutritional advice."
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
	}
];

export const OnBoardFromPage = () => {
	const navigate = useNavigate();

	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		name: "",
		age: "",
		gender: "",
		email: "",
		weight: "",
		height: ""
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleRadioChange = (id: string, val: string) => {
		setFormData({ ...formData, [id]: val });
	};

	const canGoNext = useMemo(
		() => formFields[currentStep].required && Boolean(formData[formFields[currentStep].id as keyof typeof formData]),
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
				height: Number(formData.height)
			} as UserInterface)
			.then(() => {
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
							{field.type === "radio" ? (
								<RadioGroup
									value={formData[field.id as keyof typeof formData]}
									onValueChange={(val: string) => handleRadioChange(field.id, val)}
								>
									{field.options?.map((option) => (
										<div className="flex items-center space-x-2" key={option.value}>
											<RadioGroupItem key={option.value} value={option.value} />
											<label htmlFor={option.value}>{option.label}</label>
										</div>
									))}
								</RadioGroup>
							) : (
								<Input
									id={field.id}
									type={field.type}
									placeholder={field.placeholder}
									value={formData[field.id as keyof typeof formData]}
									onChange={handleChange}
									required={field.required}
									className="w-full max-w-md"
								/>
							)}
							{field.hint && <p className="text-sm text-gray-500">{field.hint}</p>}
						</div>
					))}
				</StepperForm>
			</div>
		</div>
	);
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
