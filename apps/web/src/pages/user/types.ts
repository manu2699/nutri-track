import type { UserInterface } from "@/data/database/users";

export type FormFieldType = "text" | "number" | "radio" | "select";

export type FormField = {
	id: keyof UserInterface;
	label: string;
	type: FormFieldType;
	readonly?: boolean;
	options?: { label: string; value: string }[];
	icon?: React.ReactNode;
};

export type RendererArgs = {
	editMode: Record<string, boolean>;
	form: UserInterface;
	handleChange: (field: keyof UserInterface, value: string | number) => void;
	handleSave: (field: keyof UserInterface) => void;
	handleCancel: (field: keyof UserInterface) => void;
	handleEdit: (field: keyof UserInterface) => void;
};

export type Section = {
	title?: string;
	icon?: React.ReactNode;
	fields?: FormField[];
	renderer?: (args: RendererArgs) => React.ReactNode;
};
