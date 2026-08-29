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
				'EmptyStartPrompt flex items-center justify-center border border-mid rounded-lg border-dashed text-center p-4 w-full h-full min-h-0 transition hover:border-primary',
				darkSurfaceClassName,
			)}
			title='Click to Generate'
			onClick={onClick}
		>
			Click to Generate
		</button>
	);
}
