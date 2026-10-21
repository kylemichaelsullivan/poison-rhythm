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
				'EmptyStartPrompt flex h-full min-h-0 w-full items-center justify-center rounded-lg border-2 border-dashed border-mid bg-surface p-4 text-center text-dark transition-[colors,box-shadow] hover:border-primary hover:bg-primary/10 hover:shadow-raised focus-visible:shadow-raised',
				darkSurfaceClassName,
			)}
			title='Click to Generate'
			onClick={onClick}
		>
			Click to Generate
		</button>
	);
}
