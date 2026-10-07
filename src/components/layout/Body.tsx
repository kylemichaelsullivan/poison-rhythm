import clsx from 'clsx';
import { PlayControls } from '@/components/controls';
import { MeasuresSection } from '@/components/measures';
import { DisplayModeModal, PoisonSection } from '@/components/poison';
import { useGame, useSettings, useSubdivision } from '@/contexts';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useSoftDisableFocus } from '@/hooks/useSoftDisableFocus';
import { isBucketTrainerMode } from '@/lib/settings-schema';

export function Body() {
	const { subdivisionLevel } = useSubdivision();
	const { settings } = useSettings();
	const { poisonRhythm, measures, handleNewRound, handleReuseRound } =
		useGame();
	const { playButtonRef, handleNewPoison } =
		useSoftDisableFocus(handleNewRound);
	const bucketMode = isBucketTrainerMode(settings);
	const {
		open: displayOpen,
		onOpen: onOpenDisplayMode,
		onClose: onCloseDisplayMode,
	} = useDisclosure();

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
					onNewPoison={handleNewPoison}
					onReusePoison={handleReuseRound}
					onReuseDisabledClick={handleNewPoison}
					onOpenDisplayMode={onOpenDisplayMode}
				/>
			) : null}

			<MeasuresSection
				onNewPoison={handleNewPoison}
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
