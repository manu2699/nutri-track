import { useState } from "react";

import { calculateBMR, calculateLeanBodyMass, calculateProteinRequired } from "@nutri-track/core";
import { Card } from "@nutri-track/ui";

import { Navigation } from "@/components/navigation";
import type { UserInterface } from "@/data/database/users";
import { useDataStore } from "@/data/store";

import { RenderField } from "./components/RenderField";
import { formSections } from "./constants";

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

	return (
		<div className="page h-full">
			<div className="flex flex-col gap-6">
				{formSections.map((section, idx) => {
					if (section.renderer) {
						return (
							<>
								{section.renderer({
									editMode,
									form,
									handleChange,
									handleSave,
									handleCancel,
									handleEdit
								})}
							</>
						);
					}

					return (
						<div key={section.title ?? idx} className="space-y-3 border p-2 py-4 rounded-md">
							{section.title ? (
								<h3 className="font-medium text-grey-500 border-b-2 border-dashed border-secondary pb-2 flex items-center gap-2">
									{section.icon ? <span>{section.icon}</span> : null}
									{section.title}
								</h3>
							) : null}
							<div className="space-y-4 px-2">
								{section.fields?.map((field) => (
									<div key={field.id} className="flex items-center justify-between gap-4">
										<span className="w-max flex items-center gap-2">
											{field.icon ? <span>{field.icon}</span> : null}
											<span className="font-medium text-neutral-600 monoFont">{field.label}:</span>
										</span>
										<RenderField
											field={field}
											editMode={editMode}
											form={form}
											handleChange={handleChange}
											handleSave={handleSave}
											handleCancel={handleCancel}
											handleEdit={handleEdit}
										/>
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>
			<Navigation />
		</div>
	);
};
