import { useCallback, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button, Input, RadioGroup, RadioGroupItem } from "@nutri-track/ui";

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
		id: "sex",
		label: "What's your sex?",
		type: "radio",
		options: ["Male", "Female"],
		required: true,
		hint: "Sex can influence nutritional requirements."
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
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		name: "",
		age: "",
		sex: "",
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

	return (
		<div className="page flex flex-col justify-center items-center">
			<p className="text-2xl heading font-bold text-primary">Get Started</p>
			<div className="flex flex-col items-center w-full px-4 mt-8">
				<AnimatedCarousel onStepChange={handleStepChange} showControls={true} canGoNext={canGoNext} canGoPrev={true}>
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
										<div className="flex items-center space-x-2" key={option}>
											<RadioGroupItem key={option} value={option} />
											<label htmlFor={option}>{option}</label>
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
				</AnimatedCarousel>
				{/* {currentStep === formFields.length - 1 && (
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
						<Button onClick={() => console.log(formData)} disabled={!canGoNext}>
							Submit
						</Button>
					</motion.div>
				)} */}
			</div>
		</div>
	);
};

type CarouselProps = {
	children: React.ReactNode[];
	onStepChange?: (step: number) => void;
	initialStep?: number;
	showControls?: boolean;
	controlsClassName?: string;
	canGoNext?: boolean;
	canGoPrev?: boolean;
};

const AnimatedCarousel = ({
	children,
	onStepChange,
	initialStep = 0,
	showControls = true,
	controlsClassName = "my-6 flex justify-between self-end",
	canGoNext = true,
	canGoPrev = true
}: CarouselProps) => {
	const [currentStep, setCurrentStep] = useState(initialStep);
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
			// swipe up
			goToNextStep();
		} else if (deltaY > 50) {
			// swipe down
			goToPrevStep();
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
						className="absolute w-full h-[200px] flex flex-col gap-2 justify-center"
					>
						{children[currentStep]}
					</motion.div>
				</AnimatePresence>
			</div>
			{showControls && (
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
					<Button
						onClick={goToNextStep}
						disabled={currentStep === children.length - 1 || !canGoNext}
						variant="outline"
						size="icon"
						className="rounded-full"
					>
						<ChevronDown />
					</Button>
				</div>
			)}
		</div>
	);
};
