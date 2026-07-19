import clsx from 'clsx';
import { useId } from 'react';
import DarkIcon from '@/assets/svg/dark.svg?react';
import LightIcon from '@/assets/svg/light.svg?react';
import { useTheme } from '@/contexts';
import { Icon, type SvgIconComponent } from '../Icon';

const THEME_OPTIONS: readonly {
	value: 'light' | 'dark' | null;
	label: string;
	caption: string;
	icon?: SvgIconComponent;
}[] = [
	{
		value: null,
		label: 'System',
		caption: 'Follows your device’s appearance setting.',
	},
	{
		value: 'light',
		label: 'Light',
		caption: 'Light, no matter your device’s appearance.',
		icon: LightIcon,
	},
	{
		value: 'dark',
		label: 'Dark',
		caption: 'Dark, no matter your device’s appearance.',
		icon: DarkIcon,
	},
] as const;

export function SettingsOverlay() {
	const { theme, setTheme } = useTheme();
	const captionId = useId();
	const selectedOption =
		THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[0];

	return (
		<div className='SettingsOverlay flex w-full flex-col gap-3'>
			<fieldset className='flex flex-col gap-2' aria-describedby={captionId}>
				<legend className='pb-2 text-sm font-semibold text-dark'>Theme</legend>
				<div className='flex gap-2'>
					{THEME_OPTIONS.map((option) => {
						const isSelected = theme === option.value;
						return (
							<button
								type='button'
								className={clsx(
									'flex flex-1 items-center justify-center rounded border p-2 text-sm transition-colors',
									'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
									isSelected
										? 'border-primary bg-primary text-white'
										: 'border-mid bg-chrome text-white hover:bg-chrome-hover',
								)}
								key={option.label}
								onClick={() => setTheme(option.value)}
								aria-pressed={isSelected}
								aria-label={option.label}
								title={option.label}
							>
								{option.icon ? <Icon svg={option.icon} /> : option.label}
							</button>
						);
					})}
				</div>
			</fieldset>
			<p className='text-sm text-dark text-center' id={captionId}>
				{selectedOption.caption}
			</p>
		</div>
	);
}
