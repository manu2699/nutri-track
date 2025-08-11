import { EllipsisVertical, UserStar } from "lucide-react";

export const UserHeader = ({
	name,
	// id,
	showAvatar = true,
	showThreeDots = true
}: {
	name: string;
	id?: number;
	showAvatar?: boolean;
	showThreeDots?: boolean;
}) => {
	const getTime = () => {
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		return `${date.toDateString()} @ ${String(hours % 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
	};
	return (
		<div className="px-4 py-2 flex w-full justify-between items-center bg-accent">
			<div className="flex items-center gap-2">
				{showAvatar ? <UserStar className="size-10 bg-primary text-white rounded-full p-2" /> : null}
				<div className="ml-2">
					<div className="text-md font-bold">{name}</div>
					<div className="text-xs text-gray-700">{getTime()}</div>
				</div>
			</div>
			{showThreeDots ? (
				<div>
					<EllipsisVertical className="size-6 stroke-0.5" />
				</div>
			) : null}
		</div>
	);
};
