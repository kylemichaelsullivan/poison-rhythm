import { lazy, Suspense } from 'react';
import { usePendingDifficulty, useToast } from '@/contexts';
import { CornerModal } from '../CornerModal';

const SettingsOverlay = lazy(() =>
	import('../settings/SettingsOverlay').then((module) => ({
		default: module.SettingsOverlay,
	})),
);

export function Settings() {
	const { onHostModalClosed } = usePendingDifficulty();
	const { setStatusToastSuppressed } = useToast();

	return (
		<CornerModal
			label='Settings'
			title='Settings'
			size='xl'
			lazy
			onOpenChange={setStatusToastSuppressed}
			onClose={onHostModalClosed}
		>
			<Suspense fallback={null}>
				<SettingsOverlay />
			</Suspense>
		</CornerModal>
	);
}
