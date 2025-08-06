import { lazy, Suspense, useEffect, useState } from "react";

import { Button } from "../components/general/button";

// Component registry - maps component names to their lazy-loaded showcase components
const componentRegistry = {
	Button: lazy(() => import("./components/Button")),
	Badge: lazy(() => import("./components/Badge")),
	Drawer: lazy(() => import("./components/Drawer")),
	Input: lazy(() => import("./components/Input")),
	Checkbox: lazy(() => import("./components/Checkbox")),
	RadioGroup: lazy(() => import("./components/RadioGroup")),
	Select: lazy(() => import("./components/Select")),
	Separator: lazy(() => import("./components/Seperator")),
	Switch: lazy(() => import("./components/Switch")),
	Tabs: lazy(() => import("./components/Tabs")),
	Carousel: lazy(() => import("./components/Carousel")),
	NavBar: lazy(() => import("./components/NavBar"))
} as const;

type ComponentName = keyof typeof componentRegistry;

const componentNames = Object.keys(componentRegistry) as ComponentName[];

// Helper functions for URL management
const getComponentFromURL = (): ComponentName => {
	const urlParams = new URLSearchParams(window.location.search);
	const component = urlParams.get("component") as ComponentName;

	if (component && componentNames.includes(component)) {
		return component;
	}

	return "Button";
};

const updateURLWithComponent = (component: ComponentName) => {
	if (typeof window === "undefined") return; // SSR safety

	const url = new URL(window.location.href);
	url.searchParams.set("component", component);

	// Update URL without causing a page reload
	window.history.replaceState({}, "", url.toString());
};

export default function ComponentShowcase() {
	const [selectedComponent, setSelectedComponent] = useState<ComponentName>(() => getComponentFromURL());

	// Update URL when component changes
	useEffect(() => {
		updateURLWithComponent(selectedComponent);
	}, [selectedComponent]);

	// Handle browser back/forward navigation
	useEffect(() => {
		const handlePopState = () => {
			setSelectedComponent(getComponentFromURL());
		};

		window.addEventListener("popstate", handlePopState);

		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, []);

	const SelectedShowcase = componentRegistry[selectedComponent];

	return (
		<div className="flex h-screen bg-background">
			{/* Left Sidebar */}
			<div className="w-64 border-r border-border bg-card p-4">
				<h2 className="text-lg font-semibold mb-4 text-foreground">Components</h2>
				<nav className="space-y-2">
					{componentNames.map((name) => (
						<Button
							key={name}
							variant={selectedComponent === name ? "default" : "ghost"}
							className="w-full justify-start"
							onClick={() => setSelectedComponent(name)}
						>
							{name}
						</Button>
					))}
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-8 overflow-auto">
				<h2 className="text-3xl font-bold mb-8 text-foreground">{selectedComponent}</h2>
				<ShowcaseWrapper component={selectedComponent} />
			</div>
		</div>
	);
}

function ShowcaseWrapper({ component }: { component: ComponentName }) {
	const SelectedShowcase = componentRegistry[component];

	return (
		<Suspense
			key={component}
			fallback={
				<div className="flex items-center justify-center h-64">
					<div className="text-muted-foreground">Loading component...</div>
				</div>
			}
		>
			<SelectedShowcase />
		</Suspense>
	);
}
