import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { version } from './package.json';

// https://vite.dev/config/
export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(version),
	},
	plugins: [react(), svgr()],
	css: {
		postcss: './postcss.config.js',
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		modulePreload: false,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (
						id.includes('node_modules/react-dom') ||
						id.includes('node_modules/react/')
					) {
						return 'vendor-react';
					}
					if (
						id.includes('/src/lib/game-modes/') ||
						id.includes('/src/lib/rhythm/')
					) {
						return 'game-engine';
					}
					if (id.includes('/src/components/layout/settings/')) {
						return 'settings-ui';
					}
					if (
						id.includes('/src/lib/notation/') ||
						id.includes('/src/components/measures/MeasureNotation')
					) {
						return 'notation';
					}
				},
			},
		},
	},
});
