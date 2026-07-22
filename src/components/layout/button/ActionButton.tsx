import PersonIcon from '@/assets/svg/person.svg?react';
import { CornerModal } from '../CornerModal';

export function ActionButton() {
	return (
		<CornerModal icon={PersonIcon} label='Account' title='Account'>
			<p className='text-sm text-dark text-center'>
				Accounts aren’t available yet. Your theme, subdivision, and sound
				preferences are saved on this device.
			</p>
		</CornerModal>
	);
}
