import { createPortal } from 'react-dom';
import { ToastPanel } from '@/components/layout/ToastPanel';
import { useToast } from '@/contexts';
import { TIMED_NOTICE_DURATION_MS } from '@/lib/timed-notice';

/** App-level host for the lower-right status toast. */
export function ToastHost() {
	const { message, toastId, dismissToast } = useToast();

	if (message == null) return null;

	return createPortal(
		<div className='ToastHost pointer-events-auto fixed z-[60] bottom-[max(5.25rem,calc(4.5rem+env(safe-area-inset-bottom)))] right-[max(0.75rem,env(safe-area-inset-right))]'>
			<ToastPanel
				key={toastId}
				message={message}
				durationMs={TIMED_NOTICE_DURATION_MS}
				onDismiss={dismissToast}
			/>
		</div>,
		document.body,
	);
}
