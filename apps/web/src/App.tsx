import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

// Lazy load components with named export
const WelcomePage = lazy(() => import("./pages/welcome").then((module) => ({ default: module.WelcomePage })));
const OnBoardFromPage = lazy(() => import("./pages/onboard").then((module) => ({ default: module.OnBoardFromPage })));

const LoadingFallback = () => (
	<div className="page flex items-center justify-center h-screen">
		<p className="text-lg">Loading...</p>
	</div>
);

function App() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<Routes>
				<Route path="/" element={<WelcomePage />} />
				<Route path="/onboard" element={<OnBoardFromPage />} />
			</Routes>
		</Suspense>
	);
}

export default App;
