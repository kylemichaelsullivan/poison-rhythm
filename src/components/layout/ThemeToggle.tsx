import clsx from 'clsx';
import DarkModeIcon from '@/assets/svg/dark.svg?react';
import LightModeIcon from '@/assets/svg/light.svg?react';
import { useTheme } from '@/contexts';
import { controlButtonBaseClassName } from '@/lib/control-classes';

export function ThemeToggle() {
	const { effectiveTheme, setTheme } = useTheme();
	const label =
		effectiveTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
	const ModeIcon = effectiveTheme === 'light' ? LightModeIcon : DarkModeIcon;

	return (
		<button
			type='button'
			className={clsx('ThemeToggle', controlButtonBaseClassName, 'p-2')}
			title={label}
			onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
			aria-label={label}
		>
			<ModeIcon className='fill-current w-5 h-5' />
		</button>
	);
}
