import { useState } from "react";

import { Card } from "@nutri-track/ui";

import { Navigation } from "@/components/navigation";
import type { UserInterface } from "@/data/database/users";
import { useDataStore } from "@/data/store";

import { RenderField } from "./components/RenderField";
import { formSections } from "./constants";

export const UserPage = () => {
	const currentUser = useDataStore((s) => s.currentUser);

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
		if (currentUser.id) {
			const updatedUser = await useDataStore
				.getState()
				.userController?.updateUser(currentUser.id, { [field]: form[field] });
			if (updatedUser) {
				useDataStore.getState().setCurrentUser(updatedUser);
				setForm(updatedUser);
			}
		}
		setEditMode({ ...editMode, [field]: false });
	};

	return (
		<div className="page h-full">
			<div className="flex flex-col gap-2">
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
						<div key={section.title ?? idx} className="border p-2 px-4 rounded-md">
							{section.title ? (
								<h3 className="font-medium text-neutral-500 border-b-2 border-dashed border-secondary pb-2 px-2 mb-2 flex items-center gap-2 tracking-wider uppercase monoFont">
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
