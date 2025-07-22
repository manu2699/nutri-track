import { useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/dataentry/radio-group";

export default function RadioGroupShowcase() {
	const [value, setValue] = useState("option1");

	return (
		<div className="space-y-8">
			<section>
				<div className="space-y-4">
					<p className="text-foreground">Selected: {value}</p>
					<RadioGroup value={value} onValueChange={setValue}>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="option1" id="controlled1" />
							<label htmlFor="controlled1" className="text-foreground">
								First option
							</label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="option2" id="controlled2" />
							<label htmlFor="controlled2" className="text-foreground">
								Second option
							</label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="option3" id="controlled3" />
							<label htmlFor="controlled3" className="text-foreground">
								Third option
							</label>
						</div>
					</RadioGroup>
				</div>
			</section>

			{/* Disabled State */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Disabled State</h3>
				<RadioGroup defaultValue="disabled1" disabled>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="disabled1" id="disabled1" />
						<label htmlFor="disabled1" className="text-muted-foreground">
							Disabled option 1
						</label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="disabled2" id="disabled2" />
						<label htmlFor="disabled2" className="text-muted-foreground">
							Disabled option 2
						</label>
					</div>
				</RadioGroup>
			</section>
		</div>
	);
}
