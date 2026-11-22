import PersonIcon from '@/assets/svg/person.svg?react';
import { useProfiles, useToast } from '@/contexts';
import { ACCOUNT_LABEL } from '@/lib/ui-copy';
import { AccountPanel } from '../account';
import { CornerModal } from '../CornerModal';

export function ActionButton() {
	const { activeProfile } = useProfiles();
	const { setStatusToastSuppressed } = useToast();

	return (
		<CornerModal
			icon={PersonIcon}
			label={ACCOUNT_LABEL}
			title={ACCOUNT_LABEL}
			buttonTitle={`${ACCOUNT_LABEL}: ${activeProfile.name}`}
			detail={
				<span className='max-w-20 truncate text-xs font-medium sm:max-w-28'>
					{activeProfile.name}
				</span>
			}
			size='lg'
			onOpenChange={setStatusToastSuppressed}
		>
			<AccountPanel />
		</CornerModal>
	);
}
