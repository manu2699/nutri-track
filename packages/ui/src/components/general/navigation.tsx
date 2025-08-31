import { Children, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useAccessibleClick } from "@/lib/hooks/useAccessibleClick";
import { cn } from "@/lib/utils";

interface NavBarProps {
	className?: string;
	children: ReactNode;
}
export function NavBar({ className, children }: NavBarProps) {
	const slots = Children.toArray(children);
	const NavItems = slots.filter(
		(child) => typeof child === "object" && child !== null && "type" in child && child.type === NavBar.Item
	);

	return (
		<nav>
			<ul className={cn("w-max h-max p-2 flex flex-row place-content-center gap-4 rounded-2xl bg-accent", className)}>
				{NavItems}
			</ul>
		</nav>
	);
}

NavBar.Item = NavItem;

interface NavItemProps {
	className?: string;
	icon: ReactNode;
	label: string;
	isActive?: boolean;
	onClick: () => void;
}

export function NavItem({ className, label, icon, onClick, isActive = false }: NavItemProps) {
	const clickProps = useAccessibleClick({ onClick });
	return (
		<li
			className={cn(
				"flex flex-row items-center gap-1 px-2",
				isActive ? "bg-primary text-primary-foreground py-2 rounded-xl" : "",
				"hover:cursor-auto hover:bg-accent-hover",
				className
			)}
			{...clickProps}
		>
			{icon}
			<AnimatePresence mode="wait">
				{isActive && (
					<motion.div
						initial={{ opacity: 0, width: "0" }}
						animate={{ opacity: 1, width: "auto" }}
						exit={{ opacity: 0, width: "0" }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
						className="text-sm font-medium whitespace-nowrap overflow-hidden"
					>
						{label}
					</motion.div>
				)}
			</AnimatePresence>
			{/*{isActive ? label : null}*/}
		</li>
	);
}
