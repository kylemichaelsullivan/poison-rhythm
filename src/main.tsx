import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
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
			<SettingsProvider>
				<PreferencesProvider>
					<MetronomeProvider>
						<App />
					</MetronomeProvider>
				</PreferencesProvider>
			</SettingsProvider>
		</ThemeProvider>
	</StrictMode>,
);
