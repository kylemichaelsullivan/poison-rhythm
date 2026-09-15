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
				'EmptyStartPrompt flex items-center justify-center border-2 border-dashed border-mid rounded-lg text-center p-4 w-full h-full min-h-0 bg-surface text-dark shadow-soft transition hover:border-primary hover:bg-primary/10 hover:shadow-raised',
				darkSurfaceClassName,
			)}
			title='Click to Generate'
			onClick={onClick}
		>
			Click to Generate
		</button>
	);
}
