import { IconButton } from '@/components/ui';

type InfoGlyphButtonProps = {
	onClick: () => void;
};

export function InfoGlyphButton({ onClick }: InfoGlyphButtonProps) {
	return (
		<IconButton
			variant='info'
			label='Explain Difficulty Levels'
			onClick={onClick}
		>
			i
		</IconButton>
	);
}
