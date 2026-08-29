import type { ReactNode } from 'react';

type SettingsGroupProps = {
	title: string;
	children: ReactNode;
};

/** Light section divider inside a settings tab (no bordered panel). */
export function SettingsGroup({ title, children }: SettingsGroupProps) {
	return (
		<section className='SettingsGroup flex flex-col gap-3'>
			<h3 className='text-xs font-semibold uppercase tracking-wide text-muted'>
				{title}
			</h3>
			<div className='flex flex-col gap-3'>{children}</div>
		</section>
	);
}
