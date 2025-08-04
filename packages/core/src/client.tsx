/** biome-ignore-all lint/a11y/noSvgWithoutTitle: -- */
import { useEffect, useState } from "hono/jsx";
import { render } from "hono/jsx/dom";

const nutrientKeys = [
	"totalFats",
	"saturatedFats",
	"unSaturatedFats",
	"sugar",
	"carbs",
	"proteins",
	"sodium",
	"potassium",
	"magnesium",
	"vitaminA",
	"vitaminC",
	"vitaminD",
	"fiber",
	"calcium",
	"iron"
] as const;

const tasteOptions = ["pungent", "astringent", "spicy", "sweet", "sour", "salty", "bitter"] as const;
const calorieMeasurements = ["1piece", "1tbsp", "1tsp", "100gm", "10gm", "10ml", "100ml"] as const;

const calorieMeasurementOptions = [
	{ value: "1piece", label: "1 Piece" },
	{ value: "1tbsp", label: "1 tbsp" },
	{ value: "1tsp", label: "1 tsp" },
	{ value: "100gm", label: "100 gm" },
	{ value: "10gm", label: "10 gm" },
	{ value: "10ml", label: "10 ml" },
	{ value: "100ml", label: "100 ml" }
] as const;

const tasteOptionList = [
	{ value: "pungent", label: "Pungent" },
	{ value: "astringent", label: "Astringent" },
	{ value: "spicy", label: "Spicy" },
	{ value: "sweet", label: "Sweet" },
	{ value: "sour", label: "Sour" },
	{ value: "salty", label: "Salty" },
	{ value: "bitter", label: "Bitter" }
] as const;

type NutrientKey = (typeof nutrientKeys)[number];
type TasteOption = (typeof tasteOptions)[number];
type CalorieMeasurement = (typeof calorieMeasurements)[number];

interface FoodItem {
	itemName: string;
	calories: number;
	calorieMeasurement: CalorieMeasurement;
	nutrients: Record<NutrientKey, number | null>;
	taste: TasteOption;
	region: string;
}

type FoodDatabase = Record<string, FoodItem>;

declare global {
	interface Window {
		__NUTRI_DATA__: FoodDatabase;
	}
}

interface EditorProps {
	initialFoodsObj?: FoodDatabase;
}

export function Editor({ initialFoodsObj = {} }: EditorProps) {
	const [rows, setRows] = useState<[string, FoodItem][]>([]);
	const [editing, setEditing] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [modified, setModified] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const foodData = window.__NUTRI_DATA__ || initialFoodsObj;
		if (foodData) {
			const clonedData = JSON.parse(JSON.stringify(foodData)) as FoodDatabase;
			setRows(Object.entries(clonedData));
			setLoading(false);
		}
	}, [initialFoodsObj]);

	const filtered = rows.filter(
		([key, food]) =>
			key.toLowerCase().includes(search.toLowerCase()) || food.itemName.toLowerCase().includes(search.toLowerCase())
	);

	// Event delegation handler
	function handleFormChange(event: Event) {
		const target = event.target as HTMLInputElement | HTMLSelectElement;
		const { dataset, value } = target;
		const { key, field, nutrient } = dataset;

		if (!key || !field) return;

		setRows((prev) =>
			prev.map(([k, f]) => {
				if (k !== key) return [k, f];

				if (nutrient && field === "nutrients") {
					return [
						k,
						{
							...f,
							nutrients: {
								...f.nutrients,
								[nutrient]: value === "" ? null : parseFloat(value) || 0
							}
						}
					];
				}

				if (field === "calories") {
					return [k, { ...f, [field]: parseFloat(value) || 0 }];
				}

				return [k, { ...f, [field]: value }];
			})
		);
		setModified(true);
	}

	// Actions Event delegation
	function handleActionClick(event: Event) {
		const target = event.target as HTMLButtonElement;
		const { dataset } = target;
		const { action, key } = dataset;

		if (!action || !key) return;

		switch (action) {
			case "edit":
				setEditing(key);
				break;
			case "done":
				setEditing(null);
				break;
			case "delete":
				remove(key);
				break;
		}
	}

	function remove(key: string) {
		if (!confirm(`Are you sure you want to delete "${key}"?`)) return;
		setRows((prev) => prev.filter(([k]) => k !== key));
		setModified(true);
		if (editing === key) setEditing(null);
	}

	function add() {
		const newKey = prompt("New food key (e.g. tomato_chutney):");
		if (!newKey || newKey.trim() === "") {
			alert("Key cannot be empty");
			return;
		}

		const trimmedKey = newKey.trim();
		if (rows.some(([k]) => k === trimmedKey)) {
			alert("Key already exists");
			return;
		}

		const newFood: FoodItem = {
			itemName: "",
			calories: 0,
			calorieMeasurement: "100gm",
			nutrients: Object.fromEntries(nutrientKeys.map((k) => [k, null])) as Record<NutrientKey, number | null>,
			taste: "sweet",
			region: "India"
		};

		setRows((prev) => [...prev, [trimmedKey, newFood]]);
		setEditing(trimmedKey);
		setModified(true);
	}

	async function save() {
		setSaving(true);
		try {
			const obj = Object.fromEntries(rows);
			const response = await fetch(window.location.pathname, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(obj, null, 2)
			});

			const result = await response.json();

			if (result.ok) {
				alert("Saved successfully!");
				setModified(false);
				window.location.reload();
			} else {
				alert(`Error saving: ${result.error || "Unknown error"}`);
			}
		} catch (error) {
			alert(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
		} finally {
			setSaving(false);
		}
	}

	function formatNutrientName(key: string): string {
		return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg shadow-sm border">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden px-6">
			<div className="bg-white border-b border-gray-200 py-4 shadow-sm">
				<div className="px-4 flex items-center justify-between gap-4 mb-3">
					<h1 className="text-2xl font-bold text-gray-900 flex gap-2 items-center">
						<span>
							<DBIcon />
						</span>
						Nutri Track DB Editor
					</h1>
					<div className="flex items-center gap-4">
						<div className="relative flex-shrink-0 w-80">
							<input
								id="search"
								type="text"
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
								placeholder="Search..."
								value={search}
								onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
							/>
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<SearchIcon />
							</div>
						</div>

						<div className="flex gap-2">
							<button
								type="button"
								onClick={add}
								className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium text-sm"
								aria-label="Add new entry"
							>
								<AddIcon />
								Add Item
							</button>
							<button
								type="button"
								disabled={!modified || saving}
								onClick={save}
								className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm ${
									modified && !saving
										? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
										: "bg-gray-400 text-white cursor-not-allowed"
								}`}
								aria-label="Save changes"
							>
								{saving ? <LoadingSpinner /> : <SaveIcon />}
								{saving ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="px-4 flex justify-between items-center text-sm text-gray-600">
					<span>Total items: {filtered.length}</span>
					{modified && <span className="text-orange-600 font-medium">! Unsaved changes</span>}
				</div>
			</div>

			{/* Scrollable Table Container */}
			<div className="overflow-auto bg-white">
				<div className="min-w-max">
					<table
						className="w-full border-collapse"
						onChange={handleFormChange}
						onClick={handleActionClick}
						onKeyDown={handleActionClick}
					>
						<thead className="bg-gray-50 sticky top-0 z-20">
							<tr>
								<th className="w-48 p-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
									Item Name
								</th>
								<th className="w-24 p-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
									Calories
								</th>
								<th className="w-32 p-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
									Measurement
								</th>
								<th className="w-28 p-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
									Taste
								</th>
								<th className="w-40 p-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
									Region
								</th>
								{nutrientKeys.map((nutrientKey) => (
									<th
										key={nutrientKey}
										className="w-28 p-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200"
									>
										{formatNutrientName(nutrientKey)}
									</th>
								))}
								{/* Sticky Actions Column */}
								<th className="w-32 p-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200 sticky right-0 bg-gray-50 z-10">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-100">
							{filtered.map(([key, food]) => {
								const isEditing = editing === key;
								const inputClass = isEditing
									? "bg-white border-gray-300 text-gray-900"
									: "bg-gray-50 border-gray-200 text-gray-600 cursor-default";

								return (
									<tr key={key} className={`hover:bg-gray-50 transition-colors ${isEditing ? "bg-green-50" : ""}`}>
										{/* Item Name */}
										<td className="p-1 border-r border-gray-100">
											<input
												type="text"
												readOnly={!isEditing}
												className={`w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 ${inputClass}`}
												value={food.itemName}
												placeholder={isEditing ? "Enter item name" : ""}
												data-key={key}
												data-field="itemName"
											/>
										</td>

										<td className="p-1 border-r border-gray-100">
											<input
												type="number"
												readOnly={!isEditing}
												min="0"
												step="0.1"
												className={`w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 ${inputClass}`}
												value={food.calories}
												data-key={key}
												data-field="calories"
											/>
										</td>

										<td className="p-1 border-r border-gray-100">
											<select
												disabled={!isEditing}
												className={`w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 ${inputClass}`}
												data-key={key}
												data-field="calorieMeasurement"
											>
												{calorieMeasurementOptions.map((opt) => (
													<option key={opt.value} value={opt.value} selected={food.calorieMeasurement === opt.value}>
														{opt.label}
													</option>
												))}
											</select>
										</td>

										<td className="p-1 border-r border-gray-100">
											<select
												disabled={!isEditing}
												className={`w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 ${inputClass}`}
												data-key={key}
												data-field="taste"
											>
												{tasteOptionList.map((opt) => (
													<option key={opt.value} value={opt.value} selected={food.taste === opt.value}>
														{opt.label}
													</option>
												))}
											</select>
										</td>

										<td className="p-1 border-r border-gray-100">
											<input
												type="text"
												readOnly={!isEditing}
												className={`w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 ${inputClass}`}
												value={food.region}
												placeholder={isEditing ? "Enter region" : ""}
												data-key={key}
												data-field="region"
											/>
										</td>

										{nutrientKeys.map((nutrientKey) => (
											<td key={nutrientKey} className="p-1 border-r border-gray-100">
												<input
													type="number"
													readOnly={!isEditing}
													min="0"
													step="0.1"
													className={`w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 ${inputClass}`}
													value={food.nutrients[nutrientKey] ?? ""}
													placeholder={isEditing ? "0" : ""}
													data-key={key}
													data-field="nutrients"
													data-nutrient={nutrientKey}
												/>
											</td>
										))}

										{/* Actions */}
										<td className="p-1 px-3 w-[150px] sticky right-0 bg-white border-l border-gray-200 z-10">
											<div className="flex gap-2">
												{isEditing ? (
													<button
														type="button"
														className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 text-xs font-medium transition-colors"
														aria-label={`Save changes for ${key}`}
														data-action="done"
														data-key={key}
													>
														<CheckIcon />
														Done
													</button>
												) : (
													<button
														type="button"
														className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500 text-xs font-medium transition-colors"
														aria-label={`Edit ${key}`}
														data-action="edit"
														data-key={key}
													>
														<EditIcon />
														Edit
													</button>
												)}
												<button
													type="button"
													className="inline-flex items-center gap-1 px-2 py-1 bg-amber-200 text-amber-800 rounded-md hover:bg-amber-300 focus:outline-none focus:ring-1 focus:ring-red-500 text-xs font-medium transition-colors"
													aria-label={`Delete ${key}`}
													data-action="delete"
													data-key={key}
												>
													<TrashIcon />
													Delete
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>

					{filtered.length === 0 && (
						<div className="text-center py-12 text-gray-500">
							<p className="text-lg">No food items found</p>
							<p className="text-sm">Try adjusting your search or add a new item</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// biome-ignore lint/style/noNonNullAssertion: --
const root = document.getElementById("root")!;
render(<Editor initialFoodsObj={window.__NUTRI_DATA__ || {}} />, root);

// Icons
const DBIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<ellipse cx="12" cy="5" rx="9" ry="3" />
		<path d="M3 5V19A9 3 0 0 0 15 21.84" />
		<path d="M21 5V8" />
		<path d="M21 12L18 17H22L19 22" />
		<path d="M3 12A9 3 0 0 0 14.59 14.87" />
	</svg>
);
const SearchIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
		<path d="m21 21-4.34-4.34" />
		<circle cx="11" cy="11" r="8" />
	</svg>
);

const AddIcon = () => (
	<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
	</svg>
);

const SaveIcon = () => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
		<path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
		<path d="M7 3v4a1 1 0 0 0 1 1h7" />
	</svg>
);

const EditIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
	>
		<path d="M13 21h8" />
		<path d="m15 5 4 4" />
		<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
	</svg>
);

const CheckIcon = () => (
	<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
	</svg>
);

const TrashIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-trash-icon lucide-trash"
	>
		<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
		<path d="M3 6h18" />
		<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
	</svg>
);

const LoadingSpinner = () => (
	<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path
			className="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path>
	</svg>
);
