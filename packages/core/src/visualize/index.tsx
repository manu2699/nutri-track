import { Hono } from "hono";

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DATA_FILE = join(process.cwd(), "data/foods.db.json");

const app = new Hono();

app.get("/", (c) => {
	const data = JSON.parse(readFileSync(DATA_FILE, "utf8"));
	return c.html(
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<title>Nutri Track DB Editor</title>
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<script src="https://cdn.tailwindcss.com"></script>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: --
					dangerouslySetInnerHTML={{
						__html: `window.__NUTRI_DATA__ = ${JSON.stringify(data)};`
					}}
				/>
				<script type="module" src="/src/client.tsx" />
			</head>
			<body>
				<div id="root" />
			</body>
		</html>
	);
});

// File save/modify
app.post("/", async (c) => {
	const data = await c.req.json();
	try {
		writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
		return c.json({ ok: true });
	} catch {
		return c.json({ ok: false, error: "Could not write file." });
	}
});

export default app;
