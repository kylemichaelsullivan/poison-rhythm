import { useId } from 'react';
import { GAME_MODE_OPTIONS } from '@/components/layout/settings/settings-options';
import { useSetting } from '@/components/layout/settings/useSetting';
import type { GameMode } from '@/lib/settings-schema';
import { PlayModeEndlessOption } from './PlayModeEndlessOption';
import { PlayModeIcon } from './PlayModeIcon';
import { PlayModeOptionCard } from './PlayModeOptionCard';

/** Classic / Bucket + Endless — one settings subscription for the list. */
export function PlayModeOptionList() {
	const modeGroupName = useId();
	const [selectedMode, setSelectedMode] = useSetting('gameMode');
	const [endless, setEndless] = useSetting('endless');

	return (
		<fieldset className='m-0 flex flex-col gap-3 border-0 p-0'>
			<legend className='sr-only'>Play mode</legend>
			{GAME_MODE_OPTIONS.map((option) => {
				const selected = option.value === selectedMode;

				return (
					<PlayModeOptionCard
						key={option.value}
						id={`${modeGroupName}-${option.value}`}
						name={modeGroupName}
						value={option.value}
						label={option.label}
						description={option.description}
						selected={selected}
						onSelect={(value: GameMode) => setSelectedMode(value)}
						leading={<PlayModeIcon mode={option.value} selected={selected} />}
						selectedFooter={
							option.value === 'default' ? (
								<PlayModeEndlessOption
									endless={endless}
									onChange={setEndless}
								/>
							) : undefined
						}
					/>
				);
			})}
		</fieldset>
	);
}
