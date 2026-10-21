import { IconButton } from '@/components/ui';

type ModalCloseButtonProps = {
	onClose: () => void;
};

/** Absolute-positioned X control for modal panels. */
export function ModalCloseButton({ onClose }: ModalCloseButtonProps) {
	return (
		<div className='ModalCloseButton absolute top-[max(0.35rem,env(safe-area-inset-top))] right-[max(0.35rem,env(safe-area-inset-right))] z-20 sm:top-3 sm:right-3'>
			<IconButton variant='modalClose' label='Close Modal' onClick={onClose}>
				X
			</IconButton>
		</div>
	);
}
