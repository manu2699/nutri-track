import { useState } from "react";

import { BADGE_VARIANTS, Badge, BUTTON_VARIANTS, Button } from "@nutri-track/ui";

import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<h1>Vite + React</h1>
			<div className="card">
				<Button variant={BUTTON_VARIANTS.SECONDARY} onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</Button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
					<br />
					<Badge variant={BADGE_VARIANTS.DESTRUCTIVE}>Badge</Badge>
				</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</>
	);
}

export default App;
