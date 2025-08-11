import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

import fs from "node:fs";
import { join, resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), svgr()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src/")
		}
	},
	server: {
		host: "0.0.0.0",
		port: 5173,
		headers: {
			"Cross-Origin-Opener-Policy": "same-origin",
			"Cross-Origin-Embedder-Policy": "require-corp"
		},
		https:
			process.env.NODE_ENV === "development"
				? {
						key: fs.readFileSync(join(__dirname, "./keys/localhost-key.pem")),
						cert: fs.readFileSync(join(__dirname, "./keys/localhost-cert.pem"))
					}
				: undefined
	},
	optimizeDeps: {
		exclude: ["@sqlite.org/sqlite-wasm"]
	}
});
