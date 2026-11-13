import Volume0Icon from '@/assets/svg/volume-0.svg?react';
import Volume1Icon from '@/assets/svg/volume-1.svg?react';
import Volume2Icon from '@/assets/svg/volume-2.svg?react';
import Volume3Icon from '@/assets/svg/volume-3.svg?react';
import { Icon } from '@/components/layout/Icon';
import { segmentControlClassName } from '@/lib/control-classes';
import { MUTE_CHANNEL_NAMES } from '@/lib/settings-labels';
import type { SvgIconComponent } from '@/components/layout/Icon';

type VolumeActiveCount = 0 | 1 | 2 | 3;

export type VolumeChannelMutes = {
	muteMetronome: boolean;
	mutePlayback: boolean;
	mutePreview: boolean;
};

const ALL_UNMUTED: VolumeChannelMutes = {
	muteMetronome: false,
	mutePlayback: false,
	mutePreview: false,
};

const VOLUME_LEVEL_ICONS: Record<VolumeActiveCount, SvgIconComponent> = {
	0: Volume0Icon,
	1: Volume1Icon,
	2: Volume2Icon,
	3: Volume3Icon,
};

const VOLUME_CHANNELS = MUTE_CHANNEL_NAMES;

/** Unmuted Metronome / Playback / Preview channels → speaker waves. */
export function volumeActiveCount(
	muteMetronome: boolean,
	mutePlayback: boolean,
	mutePreview: boolean,
	includePreview = true,
): VolumeActiveCount {
	return (Number(!muteMetronome) +
		Number(!mutePlayback) +
		Number(includePreview && !mutePreview)) as VolumeActiveCount;
}

function joinChannelNames(names: readonly string[]): string {
	if (names.length <= 1) {
		return names[0] ?? '';
	}
	if (names.length === 2) {
		return `${names[0]} and ${names[1]}`;
	}
	return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function volumeChannelNames(
	muteMetronome: boolean,
	mutePlayback: boolean,
	mutePreview: boolean,
	unmuted: boolean,
	includePreview: boolean,
): string[] {
	const muted = [muteMetronome, mutePlayback, mutePreview];
	return VOLUME_CHANNELS.filter((_, index) => {
		if (!includePreview && VOLUME_CHANNELS[index] === 'Preview') {
			return false;
		}
		return muted[index] !== unmuted;
	});
}

/** Restore the last mix, or unmute every channel when there is nothing to undo. */
export function nextVolumeUnmute(
	undo: VolumeChannelMutes | null,
	includePreview = true,
): VolumeChannelMutes {
	if (
		undo &&
		volumeActiveCount(
			undo.muteMetronome,
			undo.mutePlayback,
			undo.mutePreview,
			includePreview,
		) > 0
	) {
		return undo;
	}
	return ALL_UNMUTED;
}

export function volumeMenuTriggerTitle({
	open,
	muteMetronome,
	mutePlayback,
	mutePreview,
	undoSnapshot = null,
	includePreview = true,
}: {
	open: boolean;
	muteMetronome: boolean;
	mutePlayback: boolean;
	mutePreview: boolean;
	undoSnapshot?: VolumeChannelMutes | null;
	includePreview?: boolean;
}): string {
	const active = volumeChannelNames(
		muteMetronome,
		mutePlayback,
		mutePreview,
		true,
		includePreview,
	);
	const channelCount = includePreview ? 3 : 2;

	if (open && active.length > 0) {
		return `Click to Mute ${joinChannelNames(active)}`;
	}

	if (open && active.length === 0) {
		const next = nextVolumeUnmute(undoSnapshot, includePreview);
		return `Click to Unmute ${joinChannelNames(
			volumeChannelNames(
				next.muteMetronome,
				next.mutePlayback,
				next.mutePreview,
				true,
				includePreview,
			),
		)}`;
	}

	if (active.length === channelCount) {
		return includePreview
			? 'Open Volume Menu — Metronome, Playback and Preview'
			: 'Open Volume Menu — Metronome and Playback';
	}

	if (active.length === 0) {
		return 'Open Volume Menu — All Sounds Muted';
	}

	return `Open Volume Menu — ${joinChannelNames(
		volumeChannelNames(
			muteMetronome,
			mutePlayback,
			mutePreview,
			false,
			includePreview,
		),
	)} Muted`;
}

type VolumeMenuTriggerProps = {
	open: boolean;
	activeCount: VolumeActiveCount;
	muteMetronome: boolean;
	mutePlayback: boolean;
	mutePreview: boolean;
	undoSnapshot?: VolumeChannelMutes | null;
	includePreview?: boolean;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onBlur: (relatedTarget: EventTarget | null) => void;
	onClick: () => void;
};

/** Measures header speaker — opens the Volume mute menu. */
export function VolumeMenuTrigger({
	open,
	activeCount,
	muteMetronome,
	mutePlayback,
	mutePreview,
	undoSnapshot = null,
	includePreview = true,
	onMouseEnter,
	onMouseLeave,
	onBlur,
	onClick,
}: VolumeMenuTriggerProps) {
	const title = volumeMenuTriggerTitle({
		open,
		muteMetronome,
		mutePlayback,
		mutePreview,
		undoSnapshot,
		includePreview,
	});

	return (
		<button
			type='button'
			className={segmentControlClassName(open, {
				variant: 'header',
				grow: false,
			})}
			title={title}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onBlur={(e) => onBlur(e.relatedTarget)}
			onClick={onClick}
			aria-expanded={open}
			aria-haspopup='dialog'
			aria-label='Volume'
			data-chrome-active={open || undefined}
		>
			<Icon svg={VOLUME_LEVEL_ICONS[activeCount]} size='md' />
		</button>
	);
}
