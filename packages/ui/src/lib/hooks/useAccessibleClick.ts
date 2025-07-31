type AccessibleClickOptions = {
	onClick: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
	role?: string;
	tabIndex?: number;
};

type AccessibleClickProps = {
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
	role?: string;
	tabIndex?: number;
};

export function useAccessibleClick({ onClick, role, tabIndex }: AccessibleClickOptions) {
	const props: AccessibleClickProps = {
		onClick: (e: React.MouseEvent<HTMLElement>) => onClick(e),
		onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick(e);
			}
		}
	};
	if (role) {
		props.role = role;
	}
	if (tabIndex) {
		props.tabIndex = tabIndex;
	}
	return props;
}
