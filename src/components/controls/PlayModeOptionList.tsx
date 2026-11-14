import { useId } from 'react';
import { GAME_MODE_OPTIONS } from '@/components/layout/settings/settings-options';
import { useSetting } from '@/components/layout/settings/useSetting';
import { useUpdateSetting } from '@/components/layout/settings/useUpdateSetting';
import { useGame } from '@/contexts';
import { DescribedOptionCard } from './DescribedOptionCard';
import { PlayModeEndlessOption } from './PlayModeEndlessOption';
import { PlayModeIcon } from './PlayModeIcon';
import type { GameMode } from '@/lib/settings-schema';

/**
 * Classic / Bucket + Endless. Mode changes regenerate the round; Endless only
 * flips stop-on-poison and does not rebuild measures.
 */
export function PlayModeOptionList() {
	const modeGroupName = useId();
	const { handleNewRound } = useGame();
	const { updateSettings } = useUpdateSetting();
	const [selectedMode, setSelectedMode] = useSetting('gameMode');
	const [endless, setEndless] = useSetting('endless');
	const poisonActive = selectedMode === 'default';

	function selectMode(value: GameMode) {
		if (value === selectedMode) return;
		setSelectedMode(value);
		handleNewRound({ gameMode: value });
	}

	function onEndlessChange(enabled: boolean) {
		if (!poisonActive) {
			updateSettings({ gameMode: 'default', endless: true });
			handleNewRound({ gameMode: 'default' });
			return;
		}
		setEndless(enabled);
	}

	return (
		<fieldset className='m-0 flex flex-col gap-3 border-0 p-0'>
			<legend className='sr-only'>Play mode</legend>
			{GAME_MODE_OPTIONS.map((option) => {
				const selected = option.value === selectedMode;

				return (
					<DescribedOptionCard
						key={option.value}
						id={`${modeGroupName}-${option.value}`}
						name={modeGroupName}
						value={option.value}
						label={option.label}
						description={option.description}
						selected={selected}
						onSelect={selectMode}
						leading={<PlayModeIcon mode={option.value} selected={selected} />}
						trailing={
							option.value === 'default' ? (
								<PlayModeEndlessOption
									endless={endless}
									faded={!poisonActive}
									onChange={onEndlessChange}
								/>
							) : undefined
						}
					/>
				);
			})}
		</fieldset>
	);
}
