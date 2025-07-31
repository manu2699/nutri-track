import { useState } from "react";
import { ChartNoAxesCombined, House, UserRound } from "lucide-react";

import { NavBar } from "@/components/general/navigation";

export default function NavBarComponent() {
	const [activeItem, setActiveItem] = useState<string>("Home");

	function handleClick(item: string) {
		setActiveItem(item);
	}
	return (
		<NavBar>
			<NavBar.Item
				isActive={activeItem === "Home"}
				icon={<House size={20} strokeWidth={2} />}
				label="Home"
				onClick={() => handleClick("Home")}
			/>
			<NavBar.Item
				isActive={activeItem === "Progress"}
				icon={<ChartNoAxesCombined size={20} strokeWidth={2} />}
				label="Progress"
				onClick={() => handleClick("Progress")}
			/>

			<NavBar.Item
				isActive={activeItem === "Profile"}
				icon={<UserRound size={20} />}
				label="Profile"
				onClick={() => handleClick("Profile")}
			/>
		</NavBar>
	);
}
