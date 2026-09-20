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
			<div className='flex min-w-0 w-full flex-col items-stretch gap-1 sm:w-auto sm:items-end'>
				<select
					className={clsx(
						'min-h-11 min-w-0 w-full max-w-full rounded border px-2 py-1.5 text-sm sm:max-w-[12rem]',
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
					<span className='max-w-full text-left text-[0.65rem] text-muted sm:max-w-[12rem] sm:text-right'>
						{hint}
					</span>
				) : null}
			</div>
		</SettingRow>
	);
}
