import clsx from 'clsx';

type SkipLinkProps = {
	targetId: string;
	children: string;
};

export function SkipLink({ targetId, children }: SkipLinkProps) {
	return (
		<a
			href={`#${targetId}`}
			className={clsx(
				'SkipLink sr-only bg-primary text-white text-center px-4 py-2 z-50',
				'focus:block focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white',
			)}
		>
			{children}
		</a>
	);
}
