import { Navigation } from "@/components/navigation";

export const ProgressPage = () => {
	return (
		<div className="page flex flex-col p-2 justify-between  !py-4 gap-2">
			<p>Track your intakes</p>
			<div>
				<Navigation />
			</div>
		</div>
	);
};
