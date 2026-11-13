import { useRef } from 'react';
import { useOutsideDismiss } from '@/hooks/useOutsideDismiss';
import type { ReactNode } from 'react';

type OutsideDismissRegionProps = {
	enabled: boolean;
	onDismiss: () => void;
	onEscapeDismiss?: () => void;
	className?: string;
	children: ReactNode;
};

/**
 * Owns a root ref and dismisses on outside pointerdown or Escape while enabled.
 * Prefer `useOutsideDismiss` when the caller already has a root ref.
 */
export function OutsideDismissRegion({
	enabled,
	onDismiss,
	onEscapeDismiss,
	className,
	children,
}: OutsideDismissRegionProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	useOutsideDismiss({
		enabled,
		rootRef,
		onDismiss,
		onEscapeDismiss,
	});

	return (
		<div className={className} ref={rootRef}>
			{children}
		</div>
	);
}
