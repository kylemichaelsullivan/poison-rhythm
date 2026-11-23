import { createContext, useContext } from 'react';

export type AccountUiValue = {
	open: boolean;
	editingProfileId: string | null;
	openAccount: () => void;
	closeAccount: () => void;
	startEditing: (profileId: string) => void;
	stopEditing: () => void;
};

export const AccountUiContext = createContext<AccountUiValue | null>(null);

export function useAccountUi(): AccountUiValue {
	const context = useContext(AccountUiContext);
	if (context == null) {
		throw new Error('useAccountUi must be used within AccountUiProvider');
	}
	return context;
}
