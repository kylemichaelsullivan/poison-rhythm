import PersonIcon from '@/assets/svg/person.svg?react';
import {
	useAccountUi,
	usePendingDifficulty,
	useProfiles,
	useToast,
} from '@/contexts';
import { ACCOUNT_LABEL } from '@/lib/ui-copy';
import { AccountPanel } from '../account';
import { CornerButton } from '../CornerButton';
import { Modal } from '../Modal';

export function ActionButton() {
	const { activeProfile } = useProfiles();
	const { open, editingProfileId, openAccount, closeAccount } = useAccountUi();
	const { onHostModalClosed } = usePendingDifficulty();
	const { setStatusToastSuppressed } = useToast();

	const handleOpen = () => {
		openAccount();
		setStatusToastSuppressed(true);
	};

	const handleClose = () => {
		closeAccount();
		setStatusToastSuppressed(false);
		onHostModalClosed();
	};

	return (
		<>
			<CornerButton
				label={ACCOUNT_LABEL}
				icon={PersonIcon}
				title={`${ACCOUNT_LABEL}: ${activeProfile.name}`}
				onClick={handleOpen}
			>
				<span className='max-w-20 truncate text-xs font-medium sm:max-w-28'>
					{activeProfile.name}
				</span>
			</CornerButton>
			<Modal
				open={open}
				title={ACCOUNT_LABEL}
				size={editingProfileId ? 'xl' : 'lg'}
				onClose={handleClose}
			>
				<AccountPanel />
			</Modal>
		</>
	);
}
