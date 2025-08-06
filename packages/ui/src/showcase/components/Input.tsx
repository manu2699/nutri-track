import { Input } from "@/components/dataentry/input";

export default function InputShowcase() {
	return (
		<div className="flex w-60 flex-col gap-4">
			<div>
				<h3 className="mb-2 text-lg font-medium">Text Input</h3>
				<Input type="text" placeholder="Enter text..." onChange={(e) => console.log("Text input:", e.target.value)} />
			</div>

			<div>
				<h3 className="mb-2 text-lg font-medium">Number Input</h3>
				<Input
					type="number"
					placeholder="Enter number..."
					onChange={(e) => console.log("Number input:", e.target.value)}
				/>
			</div>

			<div>
				<h3 className="mb-2 text-lg font-medium">Password Input</h3>
				<Input
					type="password"
					placeholder="Enter password..."
					onChange={(e) => console.log("Password input:", e.target.value)}
				/>
			</div>

			<div>
				<h3 className="mb-2 text-lg font-medium">Email Input</h3>
				<Input
					type="email"
					placeholder="Enter email..."
					onChange={(e) => console.log("Email input:", e.target.value)}
				/>
			</div>

			<div>
				<h3 className="mb-2 text-lg font-medium">Date Input</h3>
				<Input type="date" onChange={(e) => console.log("Date input:", e.target.value)} />
			</div>

			<div>
				<h3 className="mb-2 text-lg font-medium">Disabled Input</h3>
				<Input type="text" placeholder="Disabled input" disabled />
			</div>
		</div>
	);
}
