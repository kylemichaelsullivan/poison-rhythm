import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
	ColorPreferencesProvider,
	MetronomeProvider,
	PreferencesProvider,
	SettingsProvider,
	ThemeProvider,
} from '@/contexts';
import { prefetchMusiSyncFont } from '@/lib/notation/load-musisync-font';
import App from './App.tsx';
import './index.css';

// After CSS registers @font-face; fire-and-forget so React can paint without awaiting.
prefetchMusiSyncFont();

const assetDragSelector = 'img, svg, picture, video, canvas, audio';
const valueDragSelector =
	'textarea, input:not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="file"])';

document.addEventListener('dragstart', (event) => {
	const target = event.target;
	if (!(target instanceof Element)) return;
	if (target.closest(`${assetDragSelector}, ${valueDragSelector}`)) {
		event.preventDefault();
	}
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(
	<StrictMode>
		<ThemeProvider>
			<ColorPreferencesProvider>
				<SettingsProvider>
					<PreferencesProvider>
						<MetronomeProvider>
							<App />
						</MetronomeProvider>
					</PreferencesProvider>
				</SettingsProvider>
			</ColorPreferencesProvider>
		</ThemeProvider>
	</StrictMode>,
);
