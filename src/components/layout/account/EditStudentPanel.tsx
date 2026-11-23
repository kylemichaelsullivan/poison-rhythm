import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Row } from '@/components/ui/Row';
import {
	useAccountUi,
	usePendingDifficulty,
	useProfiles,
	useToast,
} from '@/contexts';
import { isDefaultProfileId } from '@/lib/profiles';
import {
	DONE_EDITING_PROFILE_LABEL,
	editStudentHeading,
	PROFILE_NAME_LABEL,
	profileRenamedToastMessage,
	SAVE_PROFILE_LABEL,
	TEMPO_LIMITS_GROUP_TITLE,
} from '@/lib/ui-copy';
import { SettingsGroup } from '../settings/SettingsGroup';
import { ProfileNameField } from './ProfileNameField';
import { TempoLimitsFields } from './TempoLimitsFields';

const SettingsOverlay = lazy(() =>
	import('../settings/SettingsOverlay').then((module) => ({
		default: module.SettingsOverlay,
	})),
);

type EditStudentPanelProps = {
	profileId: string;
};

export function EditStudentPanel({ profileId }: EditStudentPanelProps) {
	const { profiles, renameProfile } = useProfiles();
	const { stopEditing } = useAccountUi();
	const { onHostModalClosed } = usePendingDifficulty();
	const { showToast } = useToast();
	const profile = profiles.find((entry) => entry.id === profileId);
	const canRename = profile != null && !isDefaultProfileId(profile.id);
	const [name, setName] = useState(profile?.name ?? '');
	const leaveEditingRef = useRef(() => {});

	const saveName = () => {
		if (!canRename || profile == null) {
			return;
		}
		const trimmed = name.trim();
		if (trimmed.length === 0 || trimmed === profile.name) {
			return;
		}
		renameProfile(profile.id, trimmed);
		showToast(profileRenamedToastMessage(trimmed));
	};

	const leaveEditing = () => {
		stopEditing();
		onHostModalClosed();
	};

	const handleDone = () => {
		saveName();
		leaveEditing();
	};

	leaveEditingRef.current = leaveEditing;

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') {
				return;
			}
			event.preventDefault();
			event.stopImmediatePropagation();
			leaveEditingRef.current();
		};
		window.addEventListener('keydown', onKeyDown, true);
		return () => window.removeEventListener('keydown', onKeyDown, true);
	}, []);

	if (profile == null) {
		return null;
	}

	return (
		<div className='EditStudentPanel flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-3 py-3 sm:px-0 sm:py-0'>
			<Row gap='2' fullWidth justify='between'>
				<h3 className='min-w-0 truncate text-base font-semibold text-dark'>
					{editStudentHeading(profile.name)}
				</h3>
				<Button onClick={handleDone} variant='primary'>
					{DONE_EDITING_PROFILE_LABEL}
				</Button>
			</Row>

			{canRename ? (
				<SettingsGroup title={PROFILE_NAME_LABEL}>
					<Row gap='2' fullWidth>
						<div className='min-w-0 flex-1'>
							<ProfileNameField
								id='edit-student-name'
								value={name}
								onChange={setName}
								onSubmit={saveName}
								focusOnMount
								placeholder='Student name'
							/>
						</div>
						<Button
							onClick={saveName}
							variant='primary'
							disabled={name.trim() === '' || name.trim() === profile.name}
						>
							{SAVE_PROFILE_LABEL}
						</Button>
					</Row>
				</SettingsGroup>
			) : null}

			<SettingsGroup title={TEMPO_LIMITS_GROUP_TITLE}>
				<TempoLimitsFields />
			</SettingsGroup>

			<div className='flex min-h-0 min-w-0 flex-1 flex-col'>
				<Suspense fallback={null}>
					<SettingsOverlay />
				</Suspense>
			</div>
		</div>
	);
}
