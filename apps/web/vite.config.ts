import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), svgr()],
	server: {
		host: "0.0.0.0", // This makes the server accessible from your network
		port: 5173 // Or whatever port your app runs on
	}
});
