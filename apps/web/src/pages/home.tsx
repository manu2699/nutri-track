import { useDataStore } from "@/data/store";

export const HomePage = () => {
	const currentUser = useDataStore((s) => s.currentUser);

	return (
		<div className="page flex flex-col items-center justify-center">
			<h2 className="text-2xl font-bold text-primary">Welcome {currentUser?.name}</h2>
			<p>Had you eat your breakfast?</p>
		</div>
	);
};
