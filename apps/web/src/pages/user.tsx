import { useState } from "react";
import { Check, Edit2, X } from "lucide-react";

import {
	ActivityLevelEnum,
	calculateBMR,
	calculateLeanBodyMass,
	calculateProteinRequired,
	regions
} from "@nutri-track/core";
import {
	Button,
	Card,
	Input,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@nutri-track/ui";

import { Navigation } from "@/components/navigation";
import type { UserInterface } from "@/data/database/users";
import { useDataStore } from "@/data/store";

type FormField = {
	id: keyof UserInterface;
	label: string;
	type: "text" | "number" | "radio" | "select";
	readonly?: boolean;
	options?: { label: string; value: string }[];
};

type Section = {
	title: string;
	fields: FormField[];
};

const formSections: Section[] = [
	{
		title: "Basic Info",
		fields: [
			{ id: "name", label: "Name", type: "text" },
			{ id: "age", label: "Age", type: "number" },
			{
				id: "gender",
				label: "Gender",
				type: "radio",
				options: [
					{ label: "Male", value: "male" },
					{ label: "Female", value: "female" }
				]
			},
			{ id: "email", label: "Email", type: "text" }
		]
	},
	{
		title: "Vitals",
		fields: [
			{ id: "weight", label: "Weight (kg)", type: "number" },
			{ id: "height", label: "Height (cm)", type: "number" },
			{ id: "body_fat", label: "Body Fat (%)", type: "number" },
			{ id: "bmi", label: "BMI", type: "number", readonly: true },
			{ id: "bmr", label: "BMR", type: "number", readonly: true },
			{ id: "protein_required", label: "Protein Required (g)", type: "number", readonly: true }
		]
	},
	{
		title: "Preferences",
		fields: [
			{
				id: "activity_level",
				label: "Activity Level",
				type: "select",
				options: Object.entries(ActivityLevelEnum).map(([key, value]) => ({
					label: key,
					value
				}))
			},
			{
				id: "region",
				label: "Region",
				type: "select",
				options: regions.map((region) => ({
					label: region,
					value: region
				}))
			}
		]
	}
];

export const UserPage = () => {
	const currentUser = useDataStore((s) => s.currentUser);
	const updateUser = useDataStore((s) => s.userController?.updateUser);
	const [editMode, setEditMode] = useState<Record<string, boolean>>({});
	const [form, setForm] = useState<UserInterface>(currentUser || ({} as UserInterface));

	if (!currentUser) return <Card>No user found.</Card>;

	const handleEdit = (field: keyof UserInterface) => setEditMode({ ...editMode, [field]: true });
	const handleCancel = (field: keyof UserInterface) => {
		setForm({ ...form, [field]: currentUser[field] });
		setEditMode({ ...editMode, [field]: false });
	};

	const handleChange = (field: keyof UserInterface, value: string | number) => setForm({ ...form, [field]: value });

	const handleSave = async (field: keyof UserInterface) => {
		const updatedForm = { ...form };

		// If weight or height changed, recalculate dependent fields
		if (field === "weight" || field === "height") {
			const weight = Number(updatedForm.weight);
			const height = Number(updatedForm.height);
			const bodyFat = Number(updatedForm.body_fat) || 0;
			const activityLevel = updatedForm.activity_level || "sedentary";
			const leanBodyMass = calculateLeanBodyMass(weight, bodyFat);
			updatedForm.bmi = weight && height ? +(weight / (height / 100) ** 2).toFixed(2) : 0;
			updatedForm.bmr = calculateBMR(leanBodyMass);
			updatedForm.protein_required = calculateProteinRequired(leanBodyMass, activityLevel);
		}

		if (updateUser && currentUser.id) {
			await updateUser(currentUser.id, updatedForm);
		}
		setEditMode({ ...editMode, [field]: false });
	};

	const renderField = (field: FormField) => {
		if (editMode[field.id] && !field.readonly) {
			switch (field.type) {
				case "radio":
					return (
						<div className="flex items-center gap-4">
							<RadioGroup value={String(form[field.id])} onValueChange={(val) => handleChange(field.id, val)}>
								<div className="flex gap-4">
									{field.options?.map((option) => (
										<div key={option.value} className="flex items-center gap-2">
											<RadioGroupItem value={option.value} id={option.value} />
											<label htmlFor={option.value}>{option.label}</label>
										</div>
									))}
								</div>
							</RadioGroup>
							<div className="flex gap-1">
								<Button onClick={() => handleSave(field.id)} size="icon" variant="ghost" className="h-6 w-6">
									<Check className="h-4 w-4" />
								</Button>
								<Button onClick={() => handleCancel(field.id)} size="icon" variant="ghost" className="h-6 w-6">
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>
					);
				case "select":
					return (
						<div className="flex items-center gap-2">
							<Select value={String(form[field.id])} onValueChange={(val) => handleChange(field.id, val)}>
								<SelectTrigger className="w-[180px] bg-neutral-50 text-sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{field.options?.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<div className="flex gap-1">
								<Button onClick={() => handleSave(field.id)} size="icon" variant="ghost" className="h-6 w-6">
									<Check className="h-4 w-4" />
								</Button>
								<Button onClick={() => handleCancel(field.id)} size="icon" variant="ghost" className="h-6 w-6">
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>
					);
				default:
					return (
						<div className="flex items-center gap-2">
							<Input
								value={form[field.id] ?? ""}
								onChange={(e) => handleChange(field.id, e.target.value)}
								type={field.type}
								className="w-[180px] bg-neutral-50 text-sm"
							/>
							<div className="flex gap-1">
								<Button onClick={() => handleSave(field.id)} size="icon" variant="ghost" className="h-6 w-6">
									<Check className="h-4 w-4" />
								</Button>
								<Button onClick={() => handleCancel(field.id)} size="icon" variant="ghost" className="h-6 w-6">
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>
					);
			}
		}

		return (
			<div className="flex items-center gap-2">
				<span className="w-[180px] text-sm text-neutral-800 font-medium">{form[field.id] ?? ""}</span>
				{!field.readonly && (
					<Button
						onClick={() => handleEdit(field.id)}
						size="icon"
						variant="ghost"
						className="h-6 w-6 text-neutral-400 hover:text-neutral-900"
					>
						<Edit2 className="size-3" />
					</Button>
				)}
			</div>
		);
	};

	return (
		<div className="page flex flex-col p-2 justify-between !py-4 gap-2">
			<div className="space-y-6 border p-4 px-2 rounded-md">
				{formSections.map((section) => (
					<div key={section.title} className="space-y-3">
						<h3 className="text-sm font-medium text-grey-500 border-b-2 border-dashed border-secondary pb-2">
							{section.title}
						</h3>
						<div className="space-y-4 px-2">
							{section.fields.map((field) => (
								<div key={field.id} className="flex items-center gap-4">
									<span className="w-40 text-sm font-medium text-neutral-600 monoFont">{field.label}:</span>
									<div className="flex-1">{renderField(field)}</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
			<div>
				<Navigation />
			</div>
		</div>
	);
};
