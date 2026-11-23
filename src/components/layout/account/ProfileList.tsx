import { useId, useState } from 'react';
import { useAccountUi, useProfiles, useToast } from '@/contexts';
import { isDefaultProfileId } from '@/lib/profiles';
import {
	PROFILE_REORDER_HINT,
	profileMovedAnnouncement,
	profileSwitchToastMessage,
} from '@/lib/ui-copy';
import { ProfileRow } from './ProfileRow';
import type { DragEvent } from 'react';

export function ProfileList() {
	const {
		profiles,
		activeProfileId,
		switchProfile,
		deleteProfile,
		reorderProfile,
		moveProfile,
	} = useProfiles();
	const { startEditing } = useAccountUi();
	const { showToast, setStatusToastSuppressed } = useToast();
	const [draggingId, setDraggingId] = useState<string | null>(null);
	const [dropIndex, setDropIndex] = useState<number | null>(null);
	const [liveMessage, setLiveMessage] = useState('');
	const reorderHintId = useId();

	const announceAfterReorder = (profileId: string, toIndex: number) => {
		const profile = profiles.find((entry) => entry.id === profileId);
		if (!profile) {
			return;
		}
		setLiveMessage(
			profileMovedAnnouncement(profile.name, toIndex + 1, profiles.length),
		);
	};

	const handleMove = (profileId: string, direction: 'up' | 'down') => {
		const fromIndex = profiles.findIndex((profile) => profile.id === profileId);
		if (fromIndex < 0) {
			return;
		}
		const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
		if (toIndex < 0 || toIndex >= profiles.length) {
			return;
		}
		moveProfile(profileId, direction);
		announceAfterReorder(profileId, toIndex);
	};

	return (
		<div className='ProfileList flex flex-col gap-1.5'>
			<p id={reorderHintId} className='text-xs text-muted'>
				{PROFILE_REORDER_HINT}
			</p>
			<output className='sr-only' aria-live='polite' aria-atomic='true'>
				{liveMessage}
			</output>
			<ul className='flex flex-col gap-1.5' aria-label='Student profiles'>
				{profiles.map((profile, index) => (
					<ProfileRow
						key={profile.id}
						profile={profile}
						index={index}
						total={profiles.length}
						active={profile.id === activeProfileId}
						canDelete={
							!isDefaultProfileId(profile.id) &&
							profiles.length > 1 &&
							profile.id !== activeProfileId
						}
						dragging={draggingId === profile.id}
						dropTarget={dropIndex === index && draggingId !== profile.id}
						reorderHintId={reorderHintId}
						onSwitch={() => {
							setStatusToastSuppressed(false);
							switchProfile(profile.id);
							showToast(profileSwitchToastMessage(profile.name));
						}}
						onEdit={() => {
							if (profile.id !== activeProfileId) {
								switchProfile(profile.id);
							}
							startEditing(profile.id);
						}}
						onDelete={() => deleteProfile(profile.id)}
						onMoveUp={() => handleMove(profile.id, 'up')}
						onMoveDown={() => handleMove(profile.id, 'down')}
						onDragStart={(event: DragEvent<HTMLElement>) => {
							event.dataTransfer.effectAllowed = 'move';
							event.dataTransfer.setData('text/plain', profile.id);
							setDraggingId(profile.id);
							setDropIndex(index);
						}}
						onDragOver={(event: DragEvent<HTMLElement>) => {
							event.preventDefault();
							event.dataTransfer.dropEffect = 'move';
							if (dropIndex !== index) {
								setDropIndex(index);
							}
						}}
						onDragLeave={() => {
							if (dropIndex === index) {
								setDropIndex(null);
							}
						}}
						onDrop={(event: DragEvent<HTMLElement>) => {
							event.preventDefault();
							const sourceId =
								event.dataTransfer.getData('text/plain') || draggingId;
							if (!sourceId) {
								setDraggingId(null);
								setDropIndex(null);
								return;
							}
							reorderProfile(sourceId, index);
							announceAfterReorder(sourceId, index);
							setDraggingId(null);
							setDropIndex(null);
						}}
						onDragEnd={() => {
							setDraggingId(null);
							setDropIndex(null);
						}}
					/>
				))}
			</ul>
		</div>
	);
}
