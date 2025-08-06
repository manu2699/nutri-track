import uiConfig from "@nutri-track/ui/tailwind-config";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		...uiConfig.theme,
		extend: {
			...uiConfig.theme.extend,
			colors: {
				...uiConfig.theme.colors
			},
			borderRadius: {
				...uiConfig.theme.borderRadius
			},
			fontFamily: {
				...uiConfig.theme.fontFamily
			}
		}
	}
	// plugins: [...uiConfig.plugins]
};
