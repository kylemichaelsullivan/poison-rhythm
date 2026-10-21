import clsx from 'clsx';
import { focusVisibleRingClassName } from '@/lib/control-classes';
import { useAboutPoisonRhythm } from './AboutPoisonRhythmContext';

type AboutPoisonRhythmButtonProps = {
	variant?: 'default' | 'title';
};

export function AboutPoisonRhythmButton({
	variant = 'default',
}: AboutPoisonRhythmButtonProps) {
	const { open, openAbout } = useAboutPoisonRhythm();

	return (
		<button
			type='button'
			className={clsx(
				'AppTitleBrandTrigger rounded-sm transition-colors duration-200 ease-out',
				focusVisibleRingClassName,
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
			Poison Rhythm
		</button>
	);
}
