import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { resolve } from "node:path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src/")
		}
	},
	root: resolve(__dirname, "./src/showcase"),
	server: {
		port: 3001,
		open: true
	}
});
