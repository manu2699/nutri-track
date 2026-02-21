import { User as UserIcon } from "lucide-react";

import { Card } from "@nutri-track/ui";

import type { FormField } from "../types";
import { RenderField, type RenderFieldProps } from "./RenderField";

interface ProfileHeaderProps {
	picField: FormField | null;
	nameField: FormField;
	ageField: FormField;
	otherFields: FormField[];
	editMode: RenderFieldProps["editMode"];
	form: RenderFieldProps["form"];
	handleChange: RenderFieldProps["handleChange"];
	handleSave: RenderFieldProps["handleSave"];
	handleCancel: RenderFieldProps["handleCancel"];
	handleEdit: RenderFieldProps["handleEdit"];
}

export const ProfileHeader = ({
	picField: _picField,
	nameField,
	ageField,
	otherFields,
	editMode,
	form,
	handleChange,
	handleSave,
	handleCancel,
	handleEdit
}: ProfileHeaderProps) => {
	const userName = form.name as string | undefined;
	const avatarLetter = userName ? userName[0].toUpperCase() : null;

	const renderFieldProps = (field: FormField) => ({
		field,
		editMode,
		form,
		handleChange,
		handleSave,
		handleCancel,
		handleEdit
	});

	return (
		<Card className="p-4 rounded-md shadow-sm border bg-card">
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-4">
					<div className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex shrink-0 items-center justify-center text-2xl font-black shadow-sm border border-border/50">
						{avatarLetter ?? <UserIcon className="w-7 h-7 opacity-50" />}
					</div>

					<div className="flex flex-col flex-1 gap-1">
						<div className="flex items-center gap-2">
							<RenderField {...renderFieldProps(nameField)} />
						</div>

						<div className="flex items-center gap-2">
							<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AGE:</span>
							<RenderField {...renderFieldProps(ageField)} />
						</div>
					</div>
				</div>

				{otherFields.length > 0 && (
					<div className="flex flex-col gap-y-3">
						{otherFields.map((field) => (
							<div key={field.id} className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-2.5 text-muted-foreground min-w-[80px]">
									{field.icon ? field.icon : null}
									<span className="text-[11px] font-bold uppercase tracking-wider">{field.label}</span>
								</div>
								<div className="flex-1 flex justify-end min-w-0">
									<RenderField {...renderFieldProps(field)} />
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</Card>
	);
};
