import clsx from 'clsx';
import { useAboutPoisonRhythm } from './AboutPoisonRhythmContext';
import type { ReactNode } from 'react';

type AboutPoisonRhythmButtonProps = {
	variant?: 'default' | 'title';
	children?: ReactNode;
};

export function AboutPoisonRhythmButton({
	variant = 'default',
	children = 'Poison Rhythm',
}: AboutPoisonRhythmButtonProps) {
	const { open, openAbout } = useAboutPoisonRhythm();

	return (
		<button
			type='button'
			className={clsx(
				'AppTitleBrandTrigger inline-block rounded-sm px-2 py-1 -my-1 transition-colors duration-200 ease-out',
				variant === 'title'
					? 'max-w-full truncate text-lg font-bold sm:text-2xl'
					: 'truncate',
			)}
			title='About Poison Rhythm'
			aria-haspopup='dialog'
			aria-expanded={open}
			aria-label='About Poison Rhythm'
			onClick={openAbout}
		>
			{children}
		</button>
	);
}
