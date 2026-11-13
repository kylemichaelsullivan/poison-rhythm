import Volume0Icon from '@/assets/svg/volume-0.svg?react';
import Volume2Icon from '@/assets/svg/volume-2.svg?react';
import { Icon } from '@/components/layout/Icon';
import { IconButton } from '@/components/ui';
import { usePlaybackMute } from '@/contexts';
import { MUTE_CHANNEL_LABELS } from '@/lib/settings-labels';
import { clickToTitle, muteActionLabel } from '@/lib/ui-copy';

/** Upper-left mute control on the tempo modal. */
export function MetronomeModalMuteButton() {
	const { muted, setMuted } = usePlaybackMute('metronome');
	const action = muteActionLabel(muted);
	const channel = MUTE_CHANNEL_LABELS.metronome;

	return (
		<IconButton
			variant='modalClose'
			label={`${action} ${channel}`}
			title={clickToTitle(action, channel)}
			onClick={() => setMuted(!muted)}
		>
			<Icon svg={muted ? Volume0Icon : Volume2Icon} />
		</IconButton>
	);
}
