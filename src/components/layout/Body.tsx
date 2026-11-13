import clsx from 'clsx';
import { useCallback } from 'react';
import { PlayControls } from '@/components/controls';
import { MeasuresSection } from '@/components/measures';
import { DisplayModeModal, PoisonSection } from '@/components/poison';
import { useGame, useSettings, useSubdivision, useToast } from '@/contexts';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useSoftDisableFocus } from '@/hooks/useSoftDisableFocus';
import { isBucketTrainerMode } from '@/lib/settings-schema';
import {
	newRoundToastMessage,
	reuseRoundToastMessage,
} from '@/lib/status-toast';

export function Body() {
	const { subdivisionLevel } = useSubdivision();
	const { settings } = useSettings();
	const { showToast } = useToast();
	const { poisonRhythm, measures, round, handleNewRound, handleReuseRound } =
		useGame();
	const { playButtonRef, handleNewPoison } =
		useSoftDisableFocus(handleNewRound);
	const bucketMode = isBucketTrainerMode(settings);
	const {
		open: displayOpen,
		onOpen: onOpenDisplayMode,
		onClose: onCloseDisplayMode,
	} = useDisclosure();

	const onNewPoison = useCallback(() => {
		handleNewPoison();
		showToast(newRoundToastMessage());
	}, [handleNewPoison, showToast]);

	const onReusePoison = useCallback(() => {
		handleReuseRound();
		showToast(reuseRoundToastMessage());
	}, [handleReuseRound, showToast]);

	return (
		<main
			className={clsx(
				'Body flex flex-col flex-auto items-center gap-6 w-full max-w-4xl px-3 sm:px-4',
				subdivisionLevel === 'quarters' && 'grid-quarters',
				subdivisionLevel === 'eighths' && 'grid-eighths',
			)}
		>
			{!bucketMode ? (
				<PoisonSection
					poisonRhythm={poisonRhythm}
					hasRound={round !== null}
					onNewPoison={onNewPoison}
					onReusePoison={onReusePoison}
					onReuseDisabledClick={onNewPoison}
					onOpenDisplayMode={onOpenDisplayMode}
				/>
			) : null}

			<MeasuresSection
				onNewPoison={onNewPoison}
				onReusePoison={onReusePoison}
				onOpenDisplayMode={onOpenDisplayMode}
			/>

			<PlayControls
				disabled={measures.length === 0}
				onDisabledClick={handleNewPoison}
				playButtonRef={playButtonRef}
			/>

			<DisplayModeModal open={displayOpen} onClose={onCloseDisplayMode} />
		</main>
	);
}
