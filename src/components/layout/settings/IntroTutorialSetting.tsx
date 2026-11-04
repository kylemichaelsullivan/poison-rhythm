import { Button } from '@/components/ui';
import { useIntroTutorial } from '../intro/IntroTutorialContext';
import { SettingRow } from './SettingRow';

/** Settings → Mode control that reopens the welcome tutorial. */
export function IntroTutorialSetting() {
	const { openIntro } = useIntroTutorial();

	return (
		<SettingRow label='Welcome Tutorial'>
			<Button
				variant='secondary'
				title='Show Welcome Tutorial'
				onClick={openIntro}
			>
				Show Welcome
			</Button>
		</SettingRow>
	);
}
