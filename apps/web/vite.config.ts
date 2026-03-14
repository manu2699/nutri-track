import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
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
	plugins: [
		react(),
		svgr(),
		VitePWA({
			registerType: "prompt",
			injectRegister: "auto",
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
			},
			manifest: {
				name: "NutriTrack",
				short_name: "NutriTrack",
				description: "Track your calories and macros effortlessly.",
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone",
				icons: [
					{
						src: "pwa-64x64.png",
						sizes: "64x64",
						type: "image/png"
					},
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png"
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png"
					},
					{
						src: "maskable-icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable"
					}
				]
			}
		})
	],
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
