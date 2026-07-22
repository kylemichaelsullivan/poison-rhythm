import clsx from 'clsx';
import type { ReactNode } from 'react';

type SettingsPanelProps = {
	children: ReactNode;
	className?: string;
};

/** Bordered surface for grouping settings controls inside the settings modal. */
export function SettingsPanel({ children, className }: SettingsPanelProps) {
	return (
		<section
			className={clsx(
				'SettingsPanel flex flex-col gap-3 rounded-lg border border-mid bg-light/60 p-3',
				className,
			)}
		>
			{children}
		</section>
	);
}
