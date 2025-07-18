/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => ({
	plugins: [
		react(),
		dts({
			insertTypesEntry: true,
			exclude: ["**/*.test.tsx", "**/*.test.ts", "**/*.stories.tsx"]
		})
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./")
		}
	},
	build: {
		lib: {
			// name: 'NutriTrackUI', Needed only for UMD
			entry: resolve(__dirname, "src/index.ts"),
			formats: ["es"],
			fileName: "index"
		},
		rollupOptions: {
			// Package users will provide their own React and ReactDOM
			external: ["react", "react-dom", "react/jsx-runtime"],
			output: {
				// Preserve modules for better tree-shaking
				preserveModules: true,
				banner: "/* @nutri-track/ui library */",
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"react/jsx-runtime": "react/jsx-runtime"
				}
			},
			treeshake: {
				moduleSideEffects: false
			}
		},
		cssCodeSplit: false,
		watch: mode === "development" ? {} : null
	}
}));
