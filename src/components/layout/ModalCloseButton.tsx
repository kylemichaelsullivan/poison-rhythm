import clsx from 'clsx';
import { IconButton } from '@/components/ui';
import { modalCornerControlClassName } from '@/lib/control-classes';

type ModalCloseButtonProps = {
	onClose: () => void;
};

/** Absolute-positioned X control for modal panels. */
export function ModalCloseButton({ onClose }: ModalCloseButtonProps) {
	return (
		<div
			className={clsx('ModalCloseButton', modalCornerControlClassName('end'))}
		>
			<IconButton variant='modalClose' label='Close Modal' onClick={onClose}>
				X
			</IconButton>
		</div>
	);
}
