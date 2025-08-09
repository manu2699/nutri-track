// Copy the db file to the dist folder

import { copyFileSync } from "node:fs";
import { join } from "node:path";

const dbPath = join(process.cwd(), "src/data/foods.db.json");
const distPath = join(process.cwd(), "dist", "data", "foods.db.json");

copyFileSync(dbPath, distPath);

console.log("db.json copied to dist folder");
