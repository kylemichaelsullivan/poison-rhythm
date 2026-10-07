import clsx from 'clsx';
import { modalScrimClassName } from '@/lib/control-classes';

type ModalScrimProps = {
	onClose: () => void;
};

/** Full-bleed dismiss control behind a modal panel. */
export function ModalScrim({ onClose }: ModalScrimProps) {
	return (
		<button
			type='button'
			className={clsx('ModalScrim absolute inset-0', modalScrimClassName)}
			aria-label='Close Modal'
			onClick={onClose}
		/>
	);
}
