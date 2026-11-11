import { createContext, useContext } from 'react';

export type ToastContextValue = {
	/** Replace the current lower-right status toast. */
	showToast: (message: string) => void;
	dismissToast: () => void;
	/**
	 * When true, the central announcer ignores status diffs (Settings open).
	 */
	statusToastSuppressed: boolean;
	setStatusToastSuppressed: (suppressed: boolean) => void;
	/** Current toast message, or null when hidden. */
	message: string | null;
	/** Bumps when a new toast is shown so the timer restarts. */
	toastId: number;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
	const context = useContext(ToastContext);
	if (context == null) {
		throw new Error('useToast must be used within ToastProvider');
	}
	return context;
}
