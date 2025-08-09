import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

async function updateDb(updates) {
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const filePath = join(__dirname, "foods.db.json");

	try {
		const rawData = await readFile(filePath, "utf-8");
		const foodData = JSON.parse(rawData);

		for (const [itemName, changes] of Object.entries(updates)) {
			foodData[itemName] = {
				...foodData[itemName],
				...changes,
				nutrients: {
					...foodData[itemName].nutrients,
					...changes.nutrients
				},
				...(changes.region && { region: [...foodData[itemName].region, ...changes.region] }),
				...(changes.mealtype && { mealtype: [...foodData[itemName].mealtype, ...changes.mealtype] })
			};
		}

		await writeFile(filePath, JSON.stringify(foodData, null, 2));
		console.log("✅ JSON file updated successfully.");
	} catch (err) {
		console.error("❌ Error updating JSON:", err);
	}
}

updateDb({
	sugar: {
		glycemic_index: 65
	},
	milk: {
		calories: 62,
		nutrients: {
			calcium: 125
		},
		glycemic_index: 47
	}
});
