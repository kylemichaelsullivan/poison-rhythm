type ModalTitleProps = {
	id: string;
	children: string;
};

/** Centered modal heading paired with `aria-labelledby`. */
export function ModalTitle({ id, children }: ModalTitleProps) {
	return (
		<h2
			className='ModalTitle shrink-0 pr-10 text-center text-lg font-semibold text-black'
			id={id}
		>
			{children}
		</h2>
	);
}
