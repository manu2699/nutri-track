import { useState } from "react";

import { AutoComplete } from "@/components/datadisplay/autocomplete";

interface Item {
	label: string;
	value: string;
}

const sampleItems: Item[] = [
	{ label: "Apple", value: "apple" },
	{ label: "Banana", value: "banana" },
	{ label: "Cherry", value: "cherry" },
	{ label: "Date", value: "date" },
	{ label: "Grape", value: "grape" },
	{ label: "Lemon", value: "lemon" },
	{ label: "Mango", value: "mango" },
	{ label: "Orange", value: "orange" },
	{ label: "Peach", value: "peach" },
	{ label: "Pear", value: "pear" }
];

const AutoCompleteShowcase: React.FC = () => {
	const [searchValue, setSearchValue] = useState("");
	const [selectedValue, setSelectedValue] = useState("");
	const [filteredItems, setFilteredItems] = useState<Item[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSearchChange = (value: string) => {
		console.log("on seach parent ", value);
		setSearchValue(value);
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			const filtered = sampleItems.filter((item) => item.label.toLowerCase().includes(value.toLowerCase()));
			setFilteredItems(filtered);
			setIsLoading(false);
		}, 500);
	};

	const handleSelectValue = (value: string) => {
		setSelectedValue(value);
		setSearchValue(sampleItems.find((item) => item.value === value)?.label || "");
	};

	return (
		<div className="p-4 space-y-4">
			<h2 className="text-xl font-bold">AutoComplete Component Showcase</h2>

			{/* <div>
				<h3>Basic AutoComplete</h3>
				<AutoComplete
					searchValue={searchValue}
					onSearchChange={handleSearchChange}
					onSelectValue={handleSelectValue}
					items={filteredItems}
					isLoading={isLoading}
					selectedValue={selectedValue}
					placeholder="Search for a fruit..."
				/>
				<p className="text-sm text-gray-600 mt-2">Selected Value: {selectedValue || "None"}</p>
			</div> */}

			<div>
				<h3>AutoComplete with Custom Renderer</h3>
				<AutoComplete
					searchValue={searchValue}
					onSearchChange={handleSearchChange}
					onSelectValue={handleSelectValue}
					items={filteredItems}
					isLoading={isLoading}
					selectedValue={selectedValue}
					placeholder="Search with custom display..."
					itemRenderer={(item) => (
						<div className="p-2 cursor-pointer hover:bg-blue-100">
							<span className="font-medium">{item.label}</span> - <span className="text-gray-500">{item.value}</span>
						</div>
					)}
				/>
			</div>

			{/* <div>
				<h3>AutoComplete with No Results</h3>
				<AutoComplete
					searchValue="xyz"
					onSearchChange={() => {}}
					onSelectValue={() => {}}
					items={[]}
					isLoading={false}
					selectedValue=""
					emptyMessage="No matching items found."
					placeholder="Type something that won't match..."
				/>
			</div>  */}
		</div>
	);
};

export default AutoCompleteShowcase;
