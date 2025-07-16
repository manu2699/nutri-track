/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
	plugins: [
		react(),
		dts({
			insertTypesEntry: true,
			exclude: ["**/*.test.tsx", "**/*.test.ts", "**/*.stories.tsx"],
		}),
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./"),
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "NutriTrackUI",
			formats: ["es"],
			fileName: "index",
		},
		rollupOptions: {
			external: ["react", "react-dom", "react/jsx-runtime"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"react/jsx-runtime": "react/jsx-runtime",
				},
			},
		},
		cssCodeSplit: false,
	},
});
