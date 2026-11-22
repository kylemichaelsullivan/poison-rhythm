import clsx from 'clsx';
import ArrowDownIcon from '@/assets/svg/arrow-down.svg?react';
import ArrowUpIcon from '@/assets/svg/arrow-up.svg?react';
import DragIcon from '@/assets/svg/drag.svg?react';
import EditIcon from '@/assets/svg/edit.svg?react';
import TrashIcon from '@/assets/svg/trash.svg?react';
import { Icon } from '@/components/layout/Icon';
import { IconButton } from '@/components/ui/IconButton';
import {
	ACTIVE_PROFILE_LABEL,
	DELETE_PROFILE_LABEL,
	editProfileLabel,
	moveProfileDownLabel,
	moveProfileUpLabel,
	profileDragHandleLabel,
	switchToProfileLabel,
} from '@/lib/ui-copy';
import type { DragEvent, KeyboardEvent } from 'react';
import type { ProfileRecord } from '@/lib/profiles';

type ProfileRowProps = {
	profile: ProfileRecord;
	index: number;
	total: number;
	active: boolean;
	canRename: boolean;
	canDelete: boolean;
	dragging: boolean;
	dropTarget: boolean;
	reorderHintId: string;
	onSwitch: () => void;
	onRename: () => void;
	onDelete: () => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
	onDragStart: (event: DragEvent<HTMLElement>) => void;
	onDragOver: (event: DragEvent<HTMLElement>) => void;
	onDragLeave: () => void;
	onDrop: (event: DragEvent<HTMLElement>) => void;
	onDragEnd: () => void;
};

export function ProfileRow({
	profile,
	index,
	total,
	active,
	canRename,
	canDelete,
	dragging,
	dropTarget,
	reorderHintId,
	onSwitch,
	onRename,
	onDelete,
	onMoveUp,
	onMoveDown,
	onDragStart,
	onDragOver,
	onDragLeave,
	onDrop,
	onDragEnd,
}: ProfileRowProps) {
	const canMoveUp = index > 0;
	const canMoveDown = index < total - 1;

	const onHandleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'ArrowUp' && canMoveUp) {
			event.preventDefault();
			onMoveUp();
			return;
		}
		if (event.key === 'ArrowDown' && canMoveDown) {
			event.preventDefault();
			onMoveDown();
		}
	};

	return (
		<li
			className={clsx(
				'ProfileRow flex flex-wrap items-center gap-x-0.5 gap-y-1 rounded-lg border px-1 py-1 transition-[border-color,opacity]',
				dropTarget ? 'border-primary bg-primary/5' : 'border-mid/70 bg-surface',
				dragging && 'opacity-60',
			)}
			data-profile-id={profile.id}
			aria-grabbed={dragging || undefined}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
		>
			<button
				type='button'
				className='ProfileDragHandle inline-flex size-11 shrink-0 cursor-grab items-center justify-center rounded-lg text-dark active:cursor-grabbing'
				data-allow-drag=''
				draggable
				aria-label={profileDragHandleLabel(profile.name)}
				aria-describedby={reorderHintId}
				aria-keyshortcuts='ArrowUp ArrowDown'
				title={profileDragHandleLabel(profile.name)}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				onKeyDown={onHandleKeyDown}
			>
				<Icon svg={DragIcon} size='md' />
			</button>

			{active ? (
				<span
					className='ProfileRowLabel min-w-0 flex-1 truncate px-1 text-sm font-semibold text-dark'
					data-profile-name={profile.name}
				>
					{profile.name}
				</span>
			) : (
				<button
					type='button'
					className='ProfileRowSwitch min-w-0 flex-1 truncate rounded px-1 py-2 text-left text-sm font-medium text-dark'
					data-profile-name={profile.name}
					aria-label={switchToProfileLabel(profile.name)}
					title={switchToProfileLabel(profile.name)}
					onClick={onSwitch}
				>
					{profile.name}
				</button>
			)}

			{active ? (
				<span className='shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-primary'>
					{ACTIVE_PROFILE_LABEL}
				</span>
			) : null}

			{canRename ? (
				<IconButton
					label={editProfileLabel(profile.name)}
					title={editProfileLabel(profile.name)}
					variant='circle'
					onClick={onRename}
				>
					<span className='inline-flex size-11 items-center justify-center'>
						<Icon svg={EditIcon} size='sm' />
					</span>
				</IconButton>
			) : null}
			{canDelete ? (
				<IconButton
					label={DELETE_PROFILE_LABEL}
					title={DELETE_PROFILE_LABEL}
					variant='circle'
					onClick={onDelete}
				>
					<span className='inline-flex size-11 items-center justify-center'>
						<Icon svg={TrashIcon} size='sm' />
					</span>
				</IconButton>
			) : null}

			<div className='flex shrink-0 items-center'>
				<IconButton
					label={moveProfileUpLabel(profile.name)}
					variant='circle'
					disabled={!canMoveUp}
					onClick={onMoveUp}
				>
					<span className='inline-flex size-11 items-center justify-center'>
						<Icon svg={ArrowUpIcon} size='sm' />
					</span>
				</IconButton>
				<IconButton
					label={moveProfileDownLabel(profile.name)}
					variant='circle'
					disabled={!canMoveDown}
					onClick={onMoveDown}
				>
					<span className='inline-flex size-11 items-center justify-center'>
						<Icon svg={ArrowDownIcon} size='sm' />
					</span>
				</IconButton>
			</div>
		</li>
	);
}
