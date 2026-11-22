import { useProfiles, useToast } from '@/contexts';
import {
	PROFILES_GROUP_TITLE,
	profileCreatedToastMessage,
	TEMPO_LIMITS_GROUP_TITLE,
} from '@/lib/ui-copy';
import { SettingsGroup } from '../settings/SettingsGroup';
import { NewProfileForm } from './NewProfileForm';
import { ProfileList } from './ProfileList';
import { TempoLimitsFields } from './TempoLimitsFields';

export function AccountPanel() {
	const { createProfile } = useProfiles();
	const { showToast, setStatusToastSuppressed } = useToast();

	return (
		<div className='AccountPanel flex flex-col gap-4'>
			<SettingsGroup title={PROFILES_GROUP_TITLE}>
				<ProfileList />
				<NewProfileForm
					onCreate={(name) => {
						setStatusToastSuppressed(false);
						const created = createProfile(name);
						showToast(profileCreatedToastMessage(created.name));
					}}
				/>
			</SettingsGroup>
			<SettingsGroup title={TEMPO_LIMITS_GROUP_TITLE}>
				<TempoLimitsFields />
			</SettingsGroup>
		</div>
	);
}
