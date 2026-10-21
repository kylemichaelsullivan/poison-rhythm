import clsx from 'clsx';

type ModalTitleProps = {
	id: string;
	children: string;
	/** Edge-to-edge phone header (used by xl Settings sheet). */
	sheet?: boolean;
};

/** Centered modal heading paired with `aria-labelledby`. */
export function ModalTitle({ id, children, sheet = false }: ModalTitleProps) {
	return (
		<h2
			className={clsx(
				// Symmetric inset so text centers on the panel, not around the absolute X.
				'ModalTitle shrink-0 px-11 text-center font-semibold text-black',
				sheet
					? 'border-b border-mid/60 py-3 text-base pt-[max(0.75rem,env(safe-area-inset-top))] sm:border-b-0 sm:px-11 sm:py-0 sm:pt-0 sm:text-lg'
					: 'text-lg',
			)}
			id={id}
		>
			{children}
		</h2>
	);
}
