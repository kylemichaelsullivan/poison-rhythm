import { SettingRow } from '@/components/layout/settings/SettingRow';
import { DifficultySlider } from './DifficultySlider';
import { InfoGlyphButton } from './InfoGlyphButton';

type DifficultySettingsBlockProps = {
	sliderValue: number;
	onDifficultyChange: (next: number) => void;
	onOpenHelp: () => void;
};

/** Compact Settings → Mode difficulty block without play-mode badge. */
export function DifficultySettingsBlock({
	sliderValue,
	onDifficultyChange,
	onOpenHelp,
}: DifficultySettingsBlockProps) {
	return (
		<div className='DifficultyControls flex flex-col gap-2'>
			<SettingRow label='Difficulty'>
				<div className='flex items-center gap-2'>
					<InfoGlyphButton onClick={onOpenHelp} />
					<span className='tabular-nums text-sm font-bold'>{sliderValue}</span>
				</div>
			</SettingRow>
			<DifficultySlider
				value={sliderValue}
				onChange={onDifficultyChange}
				showValue={false}
			/>
		</div>
	);
}
