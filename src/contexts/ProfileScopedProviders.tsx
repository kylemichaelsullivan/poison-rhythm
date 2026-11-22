import { ColorPreferencesProvider } from '@/contexts/ColorPreferencesProvider';
import { MetronomeProvider } from '@/contexts/MetronomeProvider';
import { PreferencesProvider } from '@/contexts/PreferencesProvider';
import { useProfiles } from '@/contexts/ProfilesContext';
import { SettingsProvider } from '@/contexts/SettingsProvider';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import type { ReactNode } from 'react';

/**
 * Remounts preference providers when the active device profile changes so
 * localStorage keys and in-memory prefs swap together (round re-seeds via
 * GameProvider remount inside App).
 */
export function ProfileScopedProviders({ children }: { children: ReactNode }) {
	const { activeProfileId } = useProfiles();

	return (
		<ThemeProvider key={activeProfileId}>
			<ColorPreferencesProvider>
				<SettingsProvider>
					<PreferencesProvider>
						<MetronomeProvider>{children}</MetronomeProvider>
					</PreferencesProvider>
				</SettingsProvider>
			</ColorPreferencesProvider>
		</ThemeProvider>
	);
}
