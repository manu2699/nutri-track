import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";

import { useDataStore } from "./data/store";

// Lazy load components with named export
const WelcomePage = lazy(() => import("./pages/welcome").then((module) => ({ default: module.WelcomePage })));
const OnBoardFromPage = lazy(() => import("./pages/onboard").then((module) => ({ default: module.OnBoardFromPage })));
const HomePage = lazy(() => import("./pages/home").then((module) => ({ default: module.HomePage })));

const LoadingFallback = () => (
	<div className="page flex items-center justify-center h-screen">
		<p className="text-lg">Loading...</p>
	</div>
);

function App() {
	const navigate = useNavigate();
	const currentUser = useDataStore((s) => s.currentUser);
	// const isInitialized = useDataStore((s) => s.isInitialized);
	const initialize = useDataStore((s) => s.initialize);
	const isInitialized = useDataStore((s) => s.isInitialized);

	useEffect(() => {
		initialize();
	}, [initialize]);

	useEffect(() => {
		if (currentUser?.name && isInitialized) {
			navigate("/home");
		} else if (!currentUser?.name && isInitialized) {
			navigate("/onboard");
		}
	}, [currentUser, navigate, isInitialized]);

	if (!isInitialized) {
		return <LoadingFallback />;
	}

	return (
		<Suspense fallback={<LoadingFallback />}>
			<Routes>
				<Route path="/" element={<WelcomePage />} />
				<Route path="/onboard" element={<OnBoardFromPage />} />
				<Route path="/home" element={<HomePage />} />
			</Routes>
		</Suspense>
	);
}

export default App;
