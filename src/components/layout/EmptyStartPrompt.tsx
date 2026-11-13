import clsx from 'clsx';
import { darkSurfaceClassName } from '@/lib/control-classes';
import { GENERATE_ROUND_SHORT, GENERATE_ROUND_TITLE } from '@/lib/ui-copy';

type EmptyStartPromptProps = {
	onClick?: () => void;
};

export function EmptyStartPrompt({ onClick }: EmptyStartPromptProps) {
	return (
		<button
			type='button'
			className={clsx(
				'EmptyStartPrompt',
				'flex h-full min-h-0 w-full items-center justify-center rounded-lg border-2 border-dashed border-mid bg-surface p-4 text-center text-dark',
				darkSurfaceClassName,
			)}
			title={GENERATE_ROUND_TITLE}
			onClick={onClick}
		>
			{GENERATE_ROUND_SHORT}
		</button>
	);
}
