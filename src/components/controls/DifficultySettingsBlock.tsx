import { SettingRow } from '@/components/layout/settings/SettingRow';
import { DifficultySlider } from './DifficultySlider';
import { InfoGlyphButton } from './InfoGlyphButton';

type DifficultySettingsBlockProps = {
	onOpenHelp: () => void;
};

/** Compact Settings → Mode difficulty block — value sits beside the slider. */
export function DifficultySettingsBlock({
	onOpenHelp,
}: DifficultySettingsBlockProps) {
	return (
		<div className='DifficultyControls flex flex-col gap-2'>
			<SettingRow label='Difficulty'>
				<InfoGlyphButton onClick={onOpenHelp} />
			</SettingRow>
			<DifficultySlider />
		</div>
	);
}
