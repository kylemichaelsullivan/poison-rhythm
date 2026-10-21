import { SettingRow } from '@/components/layout/settings/SettingRow';
import { usePendingDifficulty } from '@/contexts';
import { DifficultySlider } from './DifficultySlider';
import { InfoGlyphButton } from './InfoGlyphButton';

type DifficultySettingsBlockProps = {
	onOpenHelp: () => void;
};

/** Compact Settings → Mode difficulty block without play-mode badge. */
export function DifficultySettingsBlock({
	onOpenHelp,
}: DifficultySettingsBlockProps) {
	const { sliderValue } = usePendingDifficulty();

	return (
		<div className='DifficultyControls flex flex-col gap-2'>
			<SettingRow label='Difficulty'>
				<div className='flex items-center gap-2'>
					<InfoGlyphButton onClick={onOpenHelp} />
					<span className='tabular-nums text-sm font-bold'>{sliderValue}</span>
				</div>
			</SettingRow>
			<DifficultySlider showValue={false} />
		</div>
	);
}
