import { useEffect, useRef } from 'react';
import {
	useSettings,
	useSoundPreferences,
	useSubdivision,
	useToast,
} from '@/contexts';
import { statusToastForTransition } from '@/lib/status-toast';
import type { GameSettings } from '@/lib/settings-schema';
import type { StatusToastSnapshot } from '@/lib/status-toast';

function takeSnapshot(
	settings: GameSettings,
	subdivisionLevel: StatusToastSnapshot['subdivisionLevel'],
	mutes: Pick<
		StatusToastSnapshot,
		'muteMetronome' | 'mutePlayback' | 'mutePreview'
	>,
): StatusToastSnapshot {
	return {
		showNextMeasure: settings.showNextMeasure,
		demoBeforePlay: settings.demoBeforePlay,
		poisonMode: settings.poisonMode,
		rhythmRenderMode: settings.rhythmRenderMode,
		scrollDirection: settings.scrollDirection,
		gameMode: settings.gameMode,
		endless: settings.endless,
		subdivisionLevel,
		muteMetronome: mutes.muteMetronome,
		mutePlayback: mutes.mutePlayback,
		mutePreview: mutes.mutePreview,
	};
}

/**
 * Diffs screen-relevant settings / prefs and shows one lower-right toast.
 * Silent on first paint and while Settings has suppressed announcements.
 */
export function StatusToastAnnouncer() {
	const { settings } = useSettings();
	const { subdivisionLevel } = useSubdivision();
	const { muteMetronome, mutePlayback, mutePreview } = useSoundPreferences();
	const { showToast, statusToastSuppressed } = useToast();
	const previousRef = useRef<StatusToastSnapshot | null>(null);

	useEffect(() => {
		const next = takeSnapshot(settings, subdivisionLevel, {
			muteMetronome,
			mutePlayback,
			mutePreview,
		});
		const previous = previousRef.current;
		previousRef.current = next;

		if (previous == null || statusToastSuppressed) return;

		const message = statusToastForTransition(previous, next);
		if (message) showToast(message);
	}, [
		settings,
		subdivisionLevel,
		muteMetronome,
		mutePlayback,
		mutePreview,
		statusToastSuppressed,
		showToast,
	]);

	return null;
}
