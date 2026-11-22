import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Row } from '@/components/ui/Row';
import { RENAME_PROFILE_LABEL } from '@/lib/ui-copy';
import { ProfileNameField } from './ProfileNameField';

type RenameProfileFormProps = {
	initialName: string;
	onSave: (name: string) => void;
	onCancel: () => void;
};

export function RenameProfileForm({
	initialName,
	onSave,
	onCancel,
}: RenameProfileFormProps) {
	const [name, setName] = useState(initialName);

	const submit = () => {
		const trimmed = name.trim();
		if (trimmed.length === 0) {
			return;
		}
		onSave(trimmed);
	};

	return (
		<li className='RenameProfileForm rounded-lg border border-primary/40 bg-surface p-1.5'>
			<Row gap='2' fullWidth>
				<div className='min-w-0 flex-1'>
					<ProfileNameField
						id='rename-profile-name'
						value={name}
						onChange={setName}
						onSubmit={submit}
						focusOnMount
					/>
				</div>
				<Button onClick={submit} variant='primary'>
					{RENAME_PROFILE_LABEL}
				</Button>
				<Button onClick={onCancel} variant='ghost'>
					Cancel
				</Button>
			</Row>
		</li>
	);
}
