import type { ComponentProps } from "react";
import { useImperativeHandle, useRef } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<ComponentProps<"input">, "onChange"> {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	onClear?: () => void;
	searchRef?: React.Ref<HTMLInputElement>;
	className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
	value,
	onChange,
	placeholder = "Search...",
	onClear,
	className,
	searchRef,
	...props
}) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(searchRef, () => inputRef.current as HTMLInputElement);

	return (
		<div className="relative flex items-center w-full">
			<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
			<input
				ref={inputRef}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={cn(
					"flex h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
					"border-b-[3px] rounded-t-md border-input focus-visible:border-b-primary",
					"pl-8 pr-9",
					className
				)}
				{...props}
			/>
			{value && (
				<button
					type="button"
					className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200"
					onClick={onClear}
					aria-label="Clear"
				>
					<X className="h-4 w-4 text-gray-400" />
				</button>
			)}
		</div>
	);
};
