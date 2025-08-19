import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";

import { useDataStore } from "./data/store";

// Lazy load components with named export
const WelcomePage = lazy(() => import("./pages/welcome").then((module) => ({ default: module.WelcomePage })));
const OnBoardFromPage = lazy(() => import("./pages/onboard").then((module) => ({ default: module.OnBoardFromPage })));
const HomePage = lazy(() => import("./pages/home").then((module) => ({ default: module.HomePage })));
const UserPage = lazy(() => import("./pages/user").then((module) => ({ default: module.UserPage })));
const ProgressPage = lazy(() => import("./pages/progress").then((module) => ({ default: module.ProgressPage })));

const LoadingFallback = () => (
	<div className="page flex items-center justify-center h-screen">
		<p className="text-lg">Loading...</p>
	</div>
);

function App() {
	const initialize = useDataStore((s) => s.initialize);
	const isInitialized = useDataStore((s) => s.isInitialized);

	useEffect(() => {
		initialize();
	}, [initialize]);

	if (!isInitialized) {
		return <LoadingFallback />;
	}

	return (
		<Suspense fallback={<LoadingFallback />}>
			<Routes>
				<Route path="/" element={<WelcomePage />} />
				<Route path="/onboard" element={<OnBoardFromPage />} />
				<Route
					path="/home"
					element={
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/progress"
					element={
						<ProtectedRoute>
							<ProgressPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/user"
					element={
						<ProtectedRoute>
							<UserPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Suspense>
	);
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	const currentUser = useDataStore((s) => s.currentUser);

	useEffect(() => {
		if (!currentUser?.name) {
			navigate("/");
		}
	}, [currentUser, navigate]);

	return <>{children}</>;
};

export default App;
