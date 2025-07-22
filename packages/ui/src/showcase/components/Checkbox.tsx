import { useState } from "react";

import { Checkbox } from "@/components/dataentry/checkbox";

export default function CheckboxShowcase() {
	const [indeterminate, setIndeterminate] = useState<boolean | "indeterminate">(true);

	return (
		<div className="space-y-8">
			{/* Basic Usage */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Basic Usage</h3>
				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<Checkbox id="basic" />
						<label htmlFor="basic" className="text-foreground">
							Accept terms and conditions
						</label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox id="disabled" disabled />
						<label htmlFor="disabled" className="text-muted-foreground">
							Disabled checkbox
						</label>
					</div>
				</div>
			</section>

			{/* Controlled Example */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Controlled Example</h3>
				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<Checkbox
							id="indeterminate"
							checked={indeterminate}
							onCheckedChange={(checked) => {
								console.log("Check ", checked);
								setIndeterminate(checked);
							}}
						/>
						<label htmlFor="indeterminate" className="text-foreground">
							Indeterminate state
						</label>
					</div>
				</div>
			</section>

			{/* Form Example */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Form Example</h3>
				<div className="space-y-3">
					<div className="flex items-center space-x-2">
						<Checkbox id="notifications" />
						<label htmlFor="notifications" className="text-foreground">
							Email notifications
						</label>
					</div>
				</div>
			</section>
		</div>
	);
}
