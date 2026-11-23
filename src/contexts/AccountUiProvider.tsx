import { useCallback, useMemo, useState } from 'react';
import { AccountUiContext } from '@/contexts/AccountUiContext';
import type { ReactNode } from 'react';

/**
 * Account dialog open/edit state lives above ProfileScopedProviders so switching
 * students does not unmount the Account modal mid-edit.
 */
export function AccountUiProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

	const openAccount = useCallback(() => {
		setOpen(true);
	}, []);

	const closeAccount = useCallback(() => {
		setOpen(false);
		setEditingProfileId(null);
	}, []);

	const startEditing = useCallback((profileId: string) => {
		setEditingProfileId(profileId);
		setOpen(true);
	}, []);

	const stopEditing = useCallback(() => {
		setEditingProfileId(null);
	}, []);

	const value = useMemo(
		() => ({
			open,
			editingProfileId,
			openAccount,
			closeAccount,
			startEditing,
			stopEditing,
		}),
		[
			open,
			editingProfileId,
			openAccount,
			closeAccount,
			startEditing,
			stopEditing,
		],
	);

	return (
		<AccountUiContext.Provider value={value}>
			{children}
		</AccountUiContext.Provider>
	);
}
