import { IconButton } from '@/components/ui';

type ModalCloseButtonProps = {
	onClose: () => void;
};

/** Absolute-positioned X control for modal panels. */
export function ModalCloseButton({ onClose }: ModalCloseButtonProps) {
	return (
		<div className='ModalCloseButton absolute top-3 right-3'>
			<IconButton variant='modalClose' label='Close Modal' onClick={onClose}>
				X
			</IconButton>
		</div>
	);
}
