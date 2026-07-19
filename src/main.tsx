import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
	DifficultyProvider,
	MetronomeProvider,
	ThemeProvider,
} from '@/contexts';
import App from './App.tsx';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(
	<StrictMode>
		<ThemeProvider>
			<MetronomeProvider>
				<DifficultyProvider>
					<App />
				</DifficultyProvider>
			</MetronomeProvider>
		</ThemeProvider>
	</StrictMode>,
);
