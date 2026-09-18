type FieldCaptionProps = {
	children: string;
	id: string;
};

/** Reserved two-line slot so theme captions don’t jump the layout. */
export function FieldCaption({ children, id }: FieldCaptionProps) {
	return (
		<p
			className='FieldCaption min-h-11 text-center text-sm leading-snug text-dark'
			id={id}
		>
			{children}
		</p>
	);
}
