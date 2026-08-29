import clsx from 'clsx';
import { GameControls, PlayControls } from '@/components/controls';
import { MeasuresSection } from '@/components/measures';
import { PoisonSection } from '@/components/poison';
import { useGame, usePreferences, useSettings } from '@/contexts';
import { useSoftDisableFocus } from '@/hooks/useSoftDisableFocus';
import { isBucketTrainerMode } from '@/lib/settings-schema';

export function Body() {
	const { subdivisionLevel } = usePreferences();
	const { settings } = useSettings();
	const { poisonRhythm, measures, handleNewRound, handleReuseRound } =
		useGame();
	const { playButtonRef, handleNewPoison } =
		useSoftDisableFocus(handleNewRound);
	const bucketMode = isBucketTrainerMode(settings);

	return (
		<main
			className={clsx(
				'Body flex flex-col flex-auto items-center gap-6 w-full max-w-4xl',
				subdivisionLevel === 'quarters' && 'grid-quarters',
				subdivisionLevel === 'eighths' && 'grid-eighths',
			)}
		>
			<GameControls />

			{!bucketMode ? (
				<PoisonSection
					poisonRhythm={poisonRhythm}
					onNewPoison={handleNewPoison}
					onReusePoison={handleReuseRound}
					onReuseDisabledClick={handleNewPoison}
				/>
			) : null}

			<MeasuresSection onNewPoison={handleNewPoison} />

			<PlayControls
				disabled={measures.length === 0}
				onDisabledClick={handleNewPoison}
				playButtonRef={playButtonRef}
			/>
		</main>
	);
}
