import { Check, Edit2, X } from "lucide-react";

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

import type { FormField } from "../types";

export interface RenderFieldProps {
	field: FormField;
	editMode: Record<string, boolean>;
	form: UserInterface;
	handleChange: (field: keyof UserInterface, value: string | number) => void;
	handleSave: (field: keyof UserInterface) => void;
	handleCancel: (field: keyof UserInterface) => void;
	handleEdit: (field: keyof UserInterface) => void;
}

export const RenderField = ({
	field,
	editMode,
	form,
	handleChange,
	handleSave,
	handleCancel,
	handleEdit
}: RenderFieldProps) => {
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
			<span className="w-max text-sm text-neutral-800 font-medium">{form[field.id] ?? ""}</span>
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
