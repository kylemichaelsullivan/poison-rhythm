import { execSync } from 'node:child_process';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

function readGitCommitSha(): string {
	try {
		return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
	} catch {
		return '';
	}
}

function readGitHubCommitUrl(sha: string): string {
	if (!sha) return '';
	try {
		const remote = execSync('git remote get-url origin', {
			encoding: 'utf8',
		}).trim();
		const match = remote.match(
			/(?:github\.com[:/]|git@github\.com:)([^/]+)\/([^/.]+)(?:\.git)?$/,
		);
		if (!match) return '';
		const [, owner, repo] = match;
		return `https://github.com/${owner}/${repo}/commit/${sha}`;
	} catch {
		return '';
	}
}

const commitSha = readGitCommitSha();
const commitUrl = readGitHubCommitUrl(commitSha);

// https://vite.dev/config/
export default defineConfig({
	define: {
		__APP_COMMIT_SHA__: JSON.stringify(commitSha),
		__APP_COMMIT_URL__: JSON.stringify(commitUrl),
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
					// Lazy UI only — keep `@/lib/notation` in the shared graph so
					// ShowNotes / settings can import duration helpers without a
					// notation ↔ settings-ui circular chunk.
					if (
						id.includes('/src/components/measures/MeasureNotation') ||
						id.includes('/src/components/measures/notation/')
					) {
						return 'notation';
					}
				},
			},
		},
	},
});
