import clsx from 'clsx';
import { inputSurfaceClassName } from '@/lib/control-classes';
import { SettingRow } from './SettingRow';

export type SelectOption<T extends string> = {
	label: string;
	value: T;
};

type SelectSettingProps<T extends string> = {
	label: string;
	value: T;
	options: readonly SelectOption<T>[];
	onChange: (value: T) => void;
	disabled?: boolean;
	hint?: string;
};

export function SelectSetting<T extends string>({
	label,
	value,
	options,
	onChange,
	disabled = false,
	hint,
}: SelectSettingProps<T>) {
	return (
		<SettingRow label={label}>
			<div className='flex min-w-0 flex-col items-end gap-1'>
				<select
					className={clsx(
						'min-w-0 max-w-[12rem] rounded border px-2 py-1.5 text-sm',
						inputSurfaceClassName,
						disabled && 'cursor-not-allowed opacity-60',
					)}
					value={value}
					disabled={disabled}
					onChange={(e) => onChange(e.target.value as T)}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{hint ? (
					<span className='max-w-[12rem] text-right text-[0.65rem] text-muted'>
						{hint}
					</span>
				) : null}
			</div>
		</SettingRow>
	);
}
