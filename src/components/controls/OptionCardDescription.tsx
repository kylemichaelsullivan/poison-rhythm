type OptionCardDescriptionProps = {
	children: string;
};

export function OptionCardDescription({
	children,
}: OptionCardDescriptionProps) {
	return <span className='text-xs text-dark'>{children}</span>;
}
