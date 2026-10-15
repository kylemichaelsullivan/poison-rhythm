import PersonIcon from '@/assets/svg/person.svg?react';
import { TIMED_NOTICE_DURATION_MS } from '@/lib/timed-notice';
import { CornerModal } from '../CornerModal';

export function ActionButton() {
	return (
		<CornerModal
			icon={PersonIcon}
			label='Account'
			title='Account'
			dismissAfterMs={TIMED_NOTICE_DURATION_MS}
		>
			<p className='text-center text-sm text-dark'>
				Accounts aren’t available yet. Your theme, subdivision, and sound
				preferences are saved on this device.
			</p>
		</CornerModal>
	);
}
