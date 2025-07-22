import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dataentry/select";

export default function SelectShowcase() {
	const [value, setValue] = useState("");

	return (
		<div className="space-y-8">
			{/* Controlled Example */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Controlled Example</h3>
				<div className="space-y-4">
					<p className="text-foreground">Selected: {value || "None"}</p>
					<div className="w-64">
						<Select value={value} onValueChange={setValue}>
							<SelectTrigger>
								<SelectValue placeholder="Choose your framework" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="react">React</SelectItem>
								<SelectItem value="vue">Vue</SelectItem>
								<SelectItem value="angular">Angular</SelectItem>
								<SelectItem value="svelte">Svelte</SelectItem>
								<SelectItem value="solid">SolidJS</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</section>

			{/* Disabled State */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Disabled State</h3>
				<div className="w-64">
					<Select disabled>
						<SelectTrigger>
							<SelectValue placeholder="Disabled select" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="item1">Item 1</SelectItem>
							<SelectItem value="item2">Item 2</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</section>
		</div>
	);
}
