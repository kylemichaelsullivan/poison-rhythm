import { lazy, Suspense } from 'react';
import { CornerModal } from '../CornerModal';

const SettingsOverlay = lazy(() =>
	import('../settings/SettingsOverlay').then((module) => ({
		default: module.SettingsOverlay,
	})),
);

export function Settings() {
	return (
		<CornerModal label='Settings' title='Settings' size='xl' lazy>
			<Suspense fallback={null}>
				<SettingsOverlay />
			</Suspense>
		</CornerModal>
	);
}
