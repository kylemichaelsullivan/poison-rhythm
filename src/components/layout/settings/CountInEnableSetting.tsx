import { useSoundPreferences } from '@/contexts';
import { EnableToggle } from './EnableToggle';

/** Settings → Sound: count-in before play. */
export function CountInEnableSetting() {
	const { countInEnabled, setCountInEnabled } = useSoundPreferences();

	return (
		<EnableToggle
			label='Count-In First'
			enabled={countInEnabled}
			onChange={setCountInEnabled}
		/>
	);
}
