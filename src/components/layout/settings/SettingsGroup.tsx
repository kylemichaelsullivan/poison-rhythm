import type { ReactNode } from 'react';

type SettingsGroupProps = {
	title: string;
	children: ReactNode;
};

/** Section block inside a settings tab — title + content with a light rule. */
export function SettingsGroup({ title, children }: SettingsGroupProps) {
	return (
		<section className='SettingsGroup flex flex-col gap-3 border-b border-mid/60 pb-6 last:border-b-0 last:pb-0'>
			<h3 className='text-xs font-semibold uppercase tracking-wide text-muted'>
				{title}
			</h3>
			<div className='flex flex-col gap-3'>{children}</div>
		</section>
	);
}
