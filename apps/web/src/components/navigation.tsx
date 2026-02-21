import { useLocation, useNavigate } from "react-router";
import { ChartNoAxesCombined, House, UserRound } from "lucide-react";

import { NavBar } from "@nutri-track/ui";

export const Navigation = () => {
	const navigate = useNavigate();
	const location = useLocation();

	function handleClick(url: string) {
		navigate(url);
	}

	return (
		<div className="navBar">
			<NavBar>
				<NavBar.Item
					isActive={location.pathname === "/home"}
					icon={<House size={20} strokeWidth={2} />}
					label="Home"
					onClick={() => handleClick("/home")}
				/>
				<NavBar.Item
					isActive={location.pathname === "/progress"}
					icon={<ChartNoAxesCombined size={20} strokeWidth={2} />}
					label="Progress"
					onClick={() => handleClick("/progress")}
				/>

				<NavBar.Item
					isActive={location.pathname === "/user"}
					icon={<UserRound size={20} />}
					label="Profile"
					onClick={() => handleClick("/user")}
				/>
			</NavBar>
		</div>
	);
};
