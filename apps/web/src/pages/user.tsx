import { Navigation } from "@/components/navigation";
import { useDataStore } from "@/data/store";
import { getDisplayTime } from "@/utils";

export const UserPage = () => {
	const currentUser = useDataStore((s) => s.currentUser);
	return (
		<div className="page flex flex-col justify-between p-2 !py-4 gap-2">
			<div>
				<p className="font-bold">{currentUser?.name}</p>
				<p>{getDisplayTime(new Date())}</p>
			</div>

			<div>
				<Navigation />
			</div>
		</div>
	);
};
