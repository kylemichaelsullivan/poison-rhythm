import { CornerModal } from '../CornerModal';
import { SettingsOverlay } from './SettingsOverlay';

export function Settings() {
	return (
		<CornerModal label='Settings' title='Settings'>
			<SettingsOverlay />
		</CornerModal>
	);
}
