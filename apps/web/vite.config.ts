import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

import fs from "node:fs";
import { resolve } from "node:path";

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
		https: {
			key: fs.readFileSync("./keys/192.168.0.102-key.pem"),
			cert: fs.readFileSync("./keys/192.168.0.102-cert.pem")
		}
	},
	optimizeDeps: {
		exclude: ["@sqlite.org/sqlite-wasm"]
	}
});
