type FieldCaptionProps = {
	children: string;
	id: string;
};

export function FieldCaption({ children, id }: FieldCaptionProps) {
	return (
		<p className='FieldCaption text-center text-sm text-dark' id={id}>
			{children}
		</p>
	);
}
