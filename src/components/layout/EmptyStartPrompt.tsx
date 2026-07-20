type EmptyStartPromptProps = {
	onClick?: () => void;
};

export function EmptyStartPrompt({ onClick }: EmptyStartPromptProps) {
	return (
		<button
			type='button'
			className='EmptyStartPrompt border border-mid rounded-lg border-dashed bg-dark/50 text-white text-center p-8 w-full transition hover:border-white'
			onClick={onClick}
		>
			Click <b>+</b> to Start
		</button>
	);
}
