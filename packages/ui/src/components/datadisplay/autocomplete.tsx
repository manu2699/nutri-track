import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Check } from "lucide-react";

import { debounce } from "@/lib/utils";

import { Skeleton } from "../feedback/skeleton";
import { SearchInput } from "../general/search";

interface Item {
	label: string;
	value: string;
	item?: any; // Optional, can be used to pass the full item object
}

interface AutoCompleteProps {
	searchValue: string;
	selectedValue?: string;
	onSearchChange: (value: string) => void;
	onSelectValue?: (value: string, item?: any) => void;
	items?: Item[];
	itemRenderer?: (item: Item) => React.ReactNode;
	isLoading?: boolean;
	emptyMessage?: string;
	placeholder?: string;
	debounceTime?: number;
	className?: string;
	forwardedRef?: React.Ref<{
		focus: () => void;
	}>;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
	searchValue = "",
	selectedValue,
	onSearchChange,
	onSelectValue,
	items = [],
	itemRenderer,
	isLoading = false,
	emptyMessage = "No results found.",
	placeholder = "Search...",
	debounceTime = 350,
	className = "",
	forwardedRef
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [internalSearchValue, setInternalSearchValue] = useState(searchValue);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setInternalSearchValue(searchValue);
	}, [searchValue]);

	const debouncedSearch = useCallback(
		debounce((query: string) => onSearchChange(query), debounceTime),
		[]
	);

	useImperativeHandle(forwardedRef, () => ({
		focus() {
			inputRef.current?.focus();
		}
	}));

	const handleInputChange = useCallback(
		(value: string) => {
			setInternalSearchValue(value);
			debouncedSearch(value);
		},
		[debouncedSearch]
	);

	const handleSelectItem = useCallback(
		(value: string, item?: any) => {
			onSelectValue?.(value, item);
			setIsOpen(false);
			inputRef.current?.blur();
		},
		[onSelectValue]
	);

	const handleClear = useCallback(() => {
		setInternalSearchValue("");
		onSearchChange("");
		inputRef.current?.focus();
	}, [onSearchChange]);

	return (
		<div className={`relative ${className}`}>
			<SearchInput
				value={internalSearchValue}
				placeholder={placeholder}
				onChange={handleInputChange}
				onClear={handleClear}
				searchRef={inputRef}
				onFocus={() => setIsOpen(true)}
				onBlur={() => setTimeout(() => setIsOpen(false), 100)}
			/>
			{isOpen && (
				<div className="absolute z-10 w-full p-2 bg-white border border-gray-200 rounded-md shadow-lg mt-1">
					<AutoCompleteItemsList
						items={items}
						itemRenderer={itemRenderer}
						isLoading={isLoading}
						emptyMessage={emptyMessage}
						handleSelectItem={handleSelectItem}
						selectedValue={selectedValue ?? ""}
					/>
				</div>
			)}
		</div>
	);
};

interface AutoCompleteItemsListProps {
	items: Item[];
	itemRenderer?: (item: Item) => React.ReactNode;
	isLoading: boolean;
	emptyMessage: string;
	handleSelectItem: (value: string, item?: any) => void;
	selectedValue: string;
}

const AutoCompleteItemsList: React.FC<AutoCompleteItemsListProps> = React.memo(
	({ items, itemRenderer, isLoading, emptyMessage, handleSelectItem, selectedValue }) => {
		if (isLoading) {
			return (
				<div className="p-2">
					<Skeleton className="h-4 w-full mb-2" />
					<Skeleton className="h-4 w-full mb-2" />
					<Skeleton className="h-4 w-full" />
				</div>
			);
		}

		if (items.length === 0) {
			return <div className="p-2 text-sm text-gray-500">{emptyMessage}</div>;
		}

		return (
			<ul className="max-h-60 overflow-y-auto">
				{items.map((item) => (
					// biome-ignore lint/a11y/useKeyWithClickEvents: --
					<li
						key={item.value}
						className="p-1 cursor-pointer hover:bg-gray-100"
						// Prevent input blur
						onMouseDown={(e) => {
							e.preventDefault();
							handleSelectItem(item.value, item.item);
						}}
						onClick={(e) => {
							e.preventDefault();
							handleSelectItem(item.value, item.item);
						}}
					>
						{itemRenderer ? (
							itemRenderer(item)
						) : (
							<div className="flex items-center gap-1 justify-between">
								<span>{item.label}</span>
								{item.value === selectedValue && <Check className="h-4 w-4" />}
							</div>
						)}
					</li>
				))}
			</ul>
		);
	}
);
