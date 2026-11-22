import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Row } from '@/components/ui/Row';
import { NEW_PROFILE_LABEL } from '@/lib/ui-copy';
import { ProfileNameField } from './ProfileNameField';

type NewProfileFormProps = {
	onCreate: (name: string) => void;
};

export function NewProfileForm({ onCreate }: NewProfileFormProps) {
	const [name, setName] = useState('');

	const submit = () => {
		const trimmed = name.trim();
		if (trimmed.length === 0) {
			return;
		}
		onCreate(trimmed);
		setName('');
	};

	return (
		<div className='NewProfileForm flex flex-col gap-1.5'>
			<label
				htmlFor='new-profile-name'
				className='text-xs font-semibold uppercase tracking-wide text-muted'
			>
				{NEW_PROFILE_LABEL}
			</label>
			<Row gap='2' fullWidth>
				<div className='min-w-0 flex-1'>
					<ProfileNameField
						id='new-profile-name'
						value={name}
						onChange={setName}
						onSubmit={submit}
						placeholder='Student name'
					/>
				</div>
				<Button
					onClick={submit}
					variant='primary'
					disabled={name.trim() === ''}
				>
					Add
				</Button>
			</Row>
		</div>
	);
}
