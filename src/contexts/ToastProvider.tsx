import { useCallback, useMemo, useState } from 'react';
import { ToastContext } from '@/contexts/ToastContext';
import type { ReactNode } from 'react';
import type { ToastContextValue } from '@/contexts/ToastContext';

export function ToastProvider({ children }: { children: ReactNode }) {
	const [message, setMessage] = useState<string | null>(null);
	const [toastId, setToastId] = useState(0);
	const [statusToastSuppressed, setStatusToastSuppressed] = useState(false);

	const showToast = useCallback((next: string) => {
		const trimmed = next.trim();
		if (!trimmed) return;
		setMessage(trimmed);
		setToastId((id) => id + 1);
	}, []);

	const dismissToast = useCallback(() => {
		setMessage(null);
	}, []);

	const value = useMemo(
		(): ToastContextValue => ({
			showToast,
			dismissToast,
			statusToastSuppressed,
			setStatusToastSuppressed,
			message,
			toastId,
		}),
		[showToast, dismissToast, statusToastSuppressed, message, toastId],
	);

	return (
		<ToastContext.Provider value={value}>{children}</ToastContext.Provider>
	);
}
