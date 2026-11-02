import { useCallback } from 'react';
import { usePlaybackMute } from '@/contexts';
import { useDisclosure } from '@/hooks/useDisclosure';

type UsePreviewSoloMuteConfirmResult = {
	mutePlayback: boolean;
	mutePreview: boolean;
	requestMutePlayback: (muted: boolean) => void;
	requestMutePreview: (muted: boolean) => void;
	confirmOpen: boolean;
	onCloseConfirm: () => void;
	onConfirm: () => void;
	onConfirmBoth: () => void;
};

/**
 * Preview-only mute is allowed after confirm (mute Preview while Playback is
 * on). Mute Both silences Playback with Preview. Turning Playback on while
 * Preview is muted restores both channels.
 */
export function usePreviewSoloMuteConfirm(): UsePreviewSoloMuteConfirmResult {
	const { muted: mutePlayback, setMuted: setMutePlayback } =
		usePlaybackMute('playback');
	const { muted: mutePreview, setMuted: setMutePreview } =
		usePlaybackMute('preview');
	const { open, onOpen, onClose } = useDisclosure();

	const requestMutePreview = useCallback(
		(muted: boolean) => {
			if (muted && !mutePlayback) {
				onOpen();
				return;
			}
			setMutePreview(muted);
		},
		[mutePlayback, onOpen, setMutePreview],
	);

	const requestMutePlayback = useCallback(
		(muted: boolean) => {
			if (!muted && mutePreview) {
				setMutePlayback(false);
				setMutePreview(false);
				return;
			}
			setMutePlayback(muted);
		},
		[mutePreview, setMutePlayback, setMutePreview],
	);

	const onConfirm = useCallback(() => {
		setMutePreview(true);
		onClose();
	}, [onClose, setMutePreview]);

	const onConfirmBoth = useCallback(() => {
		setMutePlayback(true);
		setMutePreview(true);
		onClose();
	}, [onClose, setMutePlayback, setMutePreview]);

	return {
		mutePlayback,
		mutePreview,
		requestMutePlayback,
		requestMutePreview,
		confirmOpen: open,
		onCloseConfirm: onClose,
		onConfirm,
		onConfirmBoth,
	};
}
