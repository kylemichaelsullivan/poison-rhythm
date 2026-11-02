import clsx from 'clsx';
import { useState } from 'react';
import { ClickOutside } from '@/components/layout/ClickOutside';
import { useSoundPreferences } from '@/contexts';
import { useHoverPinPopover } from '@/hooks/useHoverPinPopover';
import { VolumeMenuPanel } from './VolumeMenuPanel';
import {
	nextVolumeUnmute,
	VolumeMenuTrigger,
	volumeActiveCount,
} from './VolumeMenuTrigger';
import type { VolumeChannelMutes } from './VolumeMenuTrigger';

/** Measures speaker: hover-to-peek / click-to-pin mute menu. While open, click mutes every channel; click again restores the last mix or unmutes all. Does not open on Tab focus so Eye → Volume → Previous stays intact. */
export function VolumeMenu() {
	const {
		muteMetronome,
		setMuteMetronome,
		mutePlayback,
		setMutePlayback,
		mutePreview,
		setMutePreview,
	} = useSoundPreferences();
	const {
		open,
		wrapperRef,
		handleHoverOpen,
		handleMouseLeave,
		handleButtonClick,
		handleClickOutside,
		handleBlur,
	} = useHoverPinPopover();
	const [undoSnapshot, setUndoSnapshot] = useState<VolumeChannelMutes | null>(
		null,
	);
	const activeCount = volumeActiveCount(
		muteMetronome,
		mutePlayback,
		mutePreview,
	);

	function applyMutes(next: VolumeChannelMutes) {
		setMuteMetronome(next.muteMetronome);
		setMutePlayback(next.mutePlayback);
		setMutePreview(next.mutePreview);
	}

	function handleTriggerClick() {
		if (open && activeCount > 0) {
			setUndoSnapshot({ muteMetronome, mutePlayback, mutePreview });
			applyMutes({
				muteMetronome: true,
				mutePlayback: true,
				mutePreview: true,
			});
			return;
		}
		if (open && activeCount === 0) {
			applyMutes(nextVolumeUnmute(undoSnapshot));
			setUndoSnapshot(null);
			return;
		}
		handleButtonClick();
	}

	return (
		<div
			className={clsx('VolumeMenu relative', open && 'z-30')}
			ref={wrapperRef}
		>
			<VolumeMenuTrigger
				open={open}
				activeCount={activeCount}
				muteMetronome={muteMetronome}
				mutePlayback={mutePlayback}
				mutePreview={mutePreview}
				undoSnapshot={undoSnapshot}
				onMouseEnter={handleHoverOpen}
				onMouseLeave={handleMouseLeave}
				onBlur={handleBlur}
				onClick={handleTriggerClick}
			/>
			{open ? (
				<>
					<VolumeMenuPanel
						onMouseEnter={handleHoverOpen}
						onMouseLeave={handleMouseLeave}
					/>
					<ClickOutside
						wrapperRef={wrapperRef}
						onClickOutside={handleClickOutside}
					/>
				</>
			) : null}
		</div>
	);
}
