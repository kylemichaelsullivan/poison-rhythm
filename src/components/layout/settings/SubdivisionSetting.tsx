import { useSubdivision } from '@/contexts';
import {
	indexToLevel,
	levelToIndex,
	SUBDIVISION_LABELS,
} from '@/lib/subdivision-levels';
import { SubdivisionRangeInput } from '../SubdivisionRangeInput';
import { SettingRow } from './SettingRow';

/** Inline subdivision slider for Settings (mirrors header ShowNotes). */
export function SubdivisionSetting() {
	const { subdivisionLevel, setSubdivisionLevel } = useSubdivision();
	const value = levelToIndex(subdivisionLevel);

	return (
		<div className='SubdivisionSetting flex flex-col gap-2'>
			<SettingRow label='Subdivision'>
				<span className='tabular-nums text-sm font-bold'>
					{SUBDIVISION_LABELS[value]}
				</span>
			</SettingRow>
			<SubdivisionRangeInput
				value={value}
				onChange={(index) => setSubdivisionLevel(indexToLevel(index))}
				ticksClassName='flex justify-between text-xs text-muted'
			/>
		</div>
	);
}
