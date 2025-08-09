import React, { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { debounce } from "@/lib/utils";

import { Input } from "../dataentry/input";
import { Skeleton } from "../general/skeleton";

interface Item {
	label: string;
	value: string;
}

interface AutoCompleteProps {
	searchValue: string;
	selectedValue: string;
	onSearchChange: (value: string) => void;
	onSelectValue: (value: string) => void;
	items?: Item[];
	itemsRenderer?: (items: Item[]) => React.ReactNode;
	isLoading?: boolean;
	emptyMessage?: string;
	placeholder?: string;
	debounceTime?: number;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
	searchValue = "",
	selectedValue,
	onSearchChange,
	onSelectValue,
	items = [],
	itemsRenderer,
	isLoading = false,
	emptyMessage = "No results found.",
	placeholder = "Search...",
	debounceTime = 350
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

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			console.log("on handleInputChange", e.target.value);
			inputRef.current?.focus();
			setInternalSearchValue(e.target.value);
			debouncedSearch(e.target.value);
		},
		[debouncedSearch]
	);

	const handleSelectItem = useCallback(
		(value: string) => {
			onSelectValue(value);
			setIsOpen(false);
		},
		[onSelectValue]
	);

	return (
		<div className="relative">
			<Input
				value={internalSearchValue}
				onChange={handleInputChange}
				placeholder={placeholder}
				onFocus={() => setIsOpen(true)}
				onBlur={() => setTimeout(() => setIsOpen(false), 100)}
			/>
			{isOpen && (
				<div className="absolute z-10 w-full p-2 bg-white border border-gray-200 rounded-md shadow-lg mt-1">
					<AutoCompleteItemsList
						items={items}
						itemsRenderer={itemsRenderer}
						isLoading={isLoading}
						emptyMessage={emptyMessage}
						handleSelectItem={handleSelectItem}
						selectedValue={selectedValue}
					/>
				</div>
			)}
		</div>
	);
};

interface AutoCompleteItemsListProps {
	items: Item[];
	itemsRenderer?: (items: Item[]) => React.ReactNode;
	isLoading: boolean;
	emptyMessage: string;
	handleSelectItem: (value: string) => void;
	selectedValue: string;
}

const AutoCompleteItemsList: React.FC<AutoCompleteItemsListProps> = React.memo(
	({ items, itemsRenderer, isLoading, emptyMessage, handleSelectItem, selectedValue }) => {
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

		if (itemsRenderer) {
			return itemsRenderer(items);
		}

		return (
			<ul className="max-h-60 overflow-y-auto">
				{items.map((item) => (
					// biome-ignore lint/a11y/useKeyWithClickEvents: --
					<li
						key={item.value}
						className="p-1 cursor-pointer hover:bg-gray-100"
						onClick={() => handleSelectItem(item.value)}
					>
						<div className="flex items-center justify-between">
							{item.value === selectedValue && <Check className="h-4 w-4 mr-2" />}
							<span>{item.label}</span>
						</div>
					</li>
				))}
			</ul>
		);
	}
);
