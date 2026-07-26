import clsx from 'clsx';
import { darkSurfaceClassName } from '@/lib/control-classes';

type EmptyStartPromptProps = {
	onClick?: () => void;
};

export function EmptyStartPrompt({ onClick }: EmptyStartPromptProps) {
	return (
		<button
			type='button'
			className={clsx(
				'EmptyStartPrompt border border-mid rounded-lg border-dashed text-center p-8 w-full transition hover:border-primary',
				darkSurfaceClassName,
			)}
			onClick={onClick}
		>
			Click <b>+</b> to Start
		</button>
	);
}
