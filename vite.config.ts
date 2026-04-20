import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/

const baseUrl = "/target";

const build = {
	version: "1.0.0",
	date: new Date(),
};

export default defineConfig({
	base: baseUrl,
	build: {
		chunkSizeWarningLimit: 1024,
	},

	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: false,

			manifest: false,
			workbox: {
				cleanupOutdatedCaches: true, // Remove old caches
				skipWaiting: true, // Force app to load the new version on refresh
				clientsClaim: true, // All pages opened use the new version (don't need to close session)
				globPatterns: ["**/*.{js,css,html,svg,ico,png,jpg,mp3}"],
				// Cache google fonts
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: "NetworkFirst",
						options: {
							cacheName: "google-fonts-cache",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
			},
		}),
	],

	resolve: {
		alias: {
			"@": "/src",
		},
	},

	define: {
		__BASE_URL__: JSON.stringify(baseUrl),
		__APP_NAME__: JSON.stringify("🎯 Target"),
		__BUILD_INFOS__: JSON.stringify(build),
		__MAX_LENGTH__: JSON.stringify({ name: 20 }),
	},
});
