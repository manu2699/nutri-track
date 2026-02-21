import type React from "react";
import {
	Activity,
	Droplet,
	Dumbbell,
	Flame,
	Hash,
	Mail,
	MapPin,
	Ruler,
	Scale,
	Settings2Icon,
	User as UserIcon
} from "lucide-react";

import { ActivityLevelEnum, regions } from "@nutri-track/core";

import { ProfileHeader } from "./components/ProfileHeader";
import type { Section } from "./types";

export const formSections: Section[] = [
	{
		renderer: (args) => (
			<ProfileHeader
				picField={null}
				nameField={{ id: "name", label: "Name", type: "text", icon: <UserIcon className="size-4 text-emerald-500" /> }}
				ageField={{ id: "age", label: "Age", type: "number", icon: <Hash className="size-4 text-emerald-500" /> }}
				otherFields={[
					{
						id: "gender",
						label: "Gender",
						type: "radio",
						options: [
							{ label: "Male", value: "male" },
							{ label: "Female", value: "female" }
						],
						icon: <UserIcon className="size-4 text-emerald-500" />
					},
					{ id: "email", label: "Email", type: "text", icon: <Mail className="size-4 text-emerald-500" /> }
				]}
				{...args}
			/>
		)
	},
	{
		title: "Vitals",
		icon: <Activity className="size-4 text-emerald-500" />,
		fields: [
			{ id: "weight", label: "Weight (kg)", type: "number", icon: <Scale className="size-4 text-emerald-500" /> },
			{ id: "height", label: "Height (cm)", type: "number", icon: <Ruler className="size-4 text-blue-500" /> },
			{ id: "body_fat", label: "Body Fat (%)", type: "number", icon: <Droplet className="size-4 text-cyan-500" /> },
			{
				id: "bmi",
				label: "BMI",
				type: "number",
				readonly: true,
				icon: <Activity className="size-4 text-indigo-500" />
			},
			{ id: "bmr", label: "BMR", type: "number", readonly: true, icon: <Flame className="size-4 text-orange-500" /> },
			{
				id: "protein_required",
				label: "Protein Required (g)",
				type: "number",
				readonly: true,
				icon: <Dumbbell className="size-4 text-rose-500" />
			}
		]
	},
	{
		title: "Preferences",
		icon: <Settings2Icon className="size-4 text-emerald-500" />,
		fields: [
			{
				id: "activity_level",
				label: "Activity Level",
				type: "select",
				options: Object.entries(ActivityLevelEnum).map(([key, value]) => ({
					label: key,
					value
				})),
				icon: <Activity className="size-4 text-indigo-500" />
			},
			{
				id: "region",
				label: "Region",
				type: "select",
				options: regions.map((region) => ({
					label: region,
					value: region
				})),
				icon: <MapPin className="size-4 text-indigo-500" />
			}
		]
	}
];
