import { CornerModal } from '../CornerModal';
import { SettingsOverlay } from '../settings';

export function Settings() {
	return (
		<CornerModal label='Settings' title='Settings'>
			<SettingsOverlay />
		</CornerModal>
	);
}
