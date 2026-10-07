import { useCallback, useState } from 'react';

type UseDisclosureResult = {
	open: boolean;
	onOpen: () => void;
	onClose: () => void;
	setOpen: (open: boolean) => void;
};

/** Boolean open/close state for modals, popovers, and similar disclosure UI. */
export function useDisclosure(initialOpen = false): UseDisclosureResult {
	const [open, setOpen] = useState(initialOpen);
	const onOpen = useCallback(() => setOpen(true), []);
	const onClose = useCallback(() => setOpen(false), []);
	return { open, onOpen, onClose, setOpen };
}
