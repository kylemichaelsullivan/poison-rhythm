import { lazy, Suspense } from 'react';
import { usePendingDifficulty } from '@/contexts';
import { CornerModal } from '../CornerModal';

const SettingsOverlay = lazy(() =>
	import('../settings/SettingsOverlay').then((module) => ({
		default: module.SettingsOverlay,
	})),
);

export function Settings() {
	const { onHostModalClosed } = usePendingDifficulty();

	return (
		<CornerModal
			label='Settings'
			title='Settings'
			size='xl'
			lazy
			onClose={onHostModalClosed}
		>
			<Suspense fallback={null}>
				<SettingsOverlay />
			</Suspense>
		</CornerModal>
	);
}
