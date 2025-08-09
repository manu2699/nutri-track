import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		devServer({
			entry: "src/visualize/index.tsx"
		})
	],
	server: {
		port: 3000,
		host: true
	}
});
