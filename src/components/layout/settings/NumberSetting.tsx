import clsx from 'clsx';
import { inputSurfaceClassName } from '@/lib/control-classes';
import { SettingRow } from './SettingRow';

type NumberSettingProps = {
	label: string;
	value: number;
	min: number;
	max: number;
	onChange: (value: number) => void;
};

export function NumberSetting({
	label,
	value,
	min,
	max,
	onChange,
}: NumberSettingProps) {
	return (
		<SettingRow label={label}>
			<input
				type='number'
				min={min}
				max={max}
				value={value}
				className={clsx(
					'w-16 rounded border px-2 py-1.5 text-sm',
					inputSurfaceClassName,
				)}
				onChange={(e) => {
					const n = Number.parseInt(e.target.value, 10);
					if (!Number.isNaN(n)) {
						onChange(n);
					}
				}}
			/>
		</SettingRow>
	);
}
