import { useSubdivision } from '@/contexts';
import {
	indexToLevel,
	levelToIndex,
	SUBDIVISION_LABELS,
} from '@/lib/subdivision-levels';
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
			<input
				type='range'
				className='w-full'
				min={0}
				max={2}
				step={1}
				value={value}
				aria-label='Note Subdivisions'
				aria-valuemin={0}
				aria-valuemax={2}
				aria-valuenow={value}
				aria-valuetext={SUBDIVISION_LABELS[value]}
				onChange={(e) =>
					setSubdivisionLevel(indexToLevel(Number(e.target.value)))
				}
			/>
			<div className='flex justify-between text-xs text-muted'>
				{SUBDIVISION_LABELS.map((label) => (
					<span key={label}>{label}</span>
				))}
			</div>
		</div>
	);
}
