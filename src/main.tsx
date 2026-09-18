import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
	ColorPreferencesProvider,
	MetronomeProvider,
	PreferencesProvider,
	SettingsProvider,
	ThemeProvider,
} from '@/contexts';
import App from './App.tsx';
import './index.css';

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
