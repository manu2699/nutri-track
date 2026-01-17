import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

import fs from "node:fs";
import { join, resolve } from "node:path";

const keyPath = join(__dirname, "./keys/localhost-key.pem");
const certPath = join(__dirname, "./keys/localhost-cert.pem");
const httpsConfig =
	fs.existsSync(keyPath) && fs.existsSync(certPath)
		? {
				key: fs.readFileSync(keyPath),
				cert: fs.readFileSync(certPath)
			}
		: undefined;

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
		...(httpsConfig ? { https: httpsConfig } : {})
	},
	optimizeDeps: {
		exclude: ["@sqlite.org/sqlite-wasm"]
	}
});
