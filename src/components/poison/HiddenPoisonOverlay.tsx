import clsx from 'clsx';
import { HiddenPoisonLabel } from './HiddenPoisonLabel';

type HiddenPoisonOverlayProps = {
	label: string;
	interactive?: boolean;
	onClick?: () => void;
};

const overlayClassName =
	'absolute inset-0 flex items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 text-primary';

/** Hidden-poison overlay; button when interactive, output otherwise. */
export function HiddenPoisonOverlay({
	label,
	interactive = false,
	onClick,
}: HiddenPoisonOverlayProps) {
	if (interactive && onClick) {
		return (
			<button
				type='button'
				className={clsx(
					'HiddenPoisonOverlay',
					overlayClassName,
					'cursor-pointer',
				)}
				title='Always Show'
				aria-label='Always Show Poison Rhythm'
				onClick={onClick}
			>
				<HiddenPoisonLabel>{label}</HiddenPoisonLabel>
			</button>
		);
	}

	return (
		<output className={clsx('HiddenPoisonOverlay', overlayClassName)}>
			<HiddenPoisonLabel>{label}</HiddenPoisonLabel>
		</output>
	);
}
