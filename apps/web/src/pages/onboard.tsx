import { useState } from "react";

import {
	Button,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	Input
} from "@nutri-track/ui";

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

	const formFields = [
		{ id: "name", label: "What's your name?", placeholder: "John Doe", type: "text", required: true },
		{ id: "age", label: "How old are you?", placeholder: "30", type: "number", required: true },
		{ id: "sex", label: "What's your sex?", placeholder: "Male/Female", type: "text", required: true },
		{ id: "email", label: "What's your email?", placeholder: "john.doe@example.com", type: "email", required: true },
		{ id: "weight", label: "What's your weight (kg)?", placeholder: "70", type: "number", required: true },
		{ id: "height", label: "What's your height (cm)?", placeholder: "175", type: "number", required: true }
	];

	const handleNext = () => {
		if (currentStep < formFields.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrev = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	return (
		<div className="page flex flex-col items-center">
			<p className="text-2xl heading font-bold text-primary mt-8">Get Started</p>
			<div className="flex flex-col items-center w-full px-4 mt-16">
				<Carousel
					opts={{
						// selectedScrollSnap: currentStep,
						align: "center",
						loop: false
					}}
					className="w-full max-w-sm"
					orientation="vertical"
				>
					<CarouselContent className="w-full h-[200px]">
						{formFields.map((field) => (
							<CarouselItem key={field.id} className="justify-center items-center">
								<label htmlFor={field.id} className="font-semibold mb-4">
									{field.label}
								</label>
								<Input
									id={field.id}
									type={field.type}
									placeholder={field.placeholder}
									value={formData[field.id as keyof typeof formData]}
									onChange={handleChange}
									required={field.required}
									className="w-full max-w-md"
								/>
							</CarouselItem>
						))}
					</CarouselContent>
					<div className="my-6 flex justify-between self-end">
						<CarouselPrevious />
						<CarouselNext />
					</div>
				</Carousel>
			</div>
			{/* <div className="flex justify-between w-full px-8 mb-16">
				<Button onClick={handlePrev} disabled={currentStep === 0}>
					Previous
				</Button>
				<Button onClick={handleNext} disabled={currentStep === formFields.length - 1}>
					Next
				</Button>
			</div> */}
		</div>
	);
};
