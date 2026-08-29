type OptionCardTitleProps = {
	children: string;
};

export function OptionCardTitle({ children }: OptionCardTitleProps) {
	return <span className='text-sm font-semibold text-black'>{children}</span>;
}
