import clsx from 'clsx';
import { useId } from 'react';
import type { GameMode } from '@/lib/settings-schema';

type PlayModeBucketIconProps = {
	active: boolean;
	className?: string;
};

/** Bucket glyph with favicon mint → purple gradient when active. */
export function PlayModeBucketIcon({
	active,
	className,
}: PlayModeBucketIconProps) {
	const gradientId = useId().replace(/:/g, '');

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='18 8 63.5 84'
			className={clsx('PlayModeBucketIcon', className)}
			role='presentation'
		>
			<defs>
				<linearGradient
					id={gradientId}
					x1='50'
					y1='12'
					x2='50'
					y2='88'
					gradientUnits='userSpaceOnUse'
				>
					<stop offset='0%' stopColor='var(--color-brand-mint-bright)' />
					<stop offset='38%' stopColor='var(--color-brand-mint)' />
					<stop offset='62%' stopColor='var(--color-brand-purple)' />
					<stop offset='100%' stopColor='var(--color-brand-purple-deep)' />
				</linearGradient>
			</defs>
			<path
				d='m60 12c2.3711 0 4.3594 1.6523 4.8711 3.8672 5.3281 1.9805 9.1289 7.1133 9.1289 13.129v7h1c2.7617 0 5 2.2422 5 5 0 2.1367-1.3398 3.957-3.2188 4.6719l-5.0977 35.469c-0.56641 3.9375-3.9375 6.8594-7.918 6.8594h-26.773c-3.918 0-7.2578-2.8359-7.8945-6.7031l-5.8477-35.613c-1.8984-0.70703-3.25-2.5352-3.25-4.6836 0-2.7578 2.2383-5 5-5h1v-7c0-6.0156 3.7969-11.148 9.1289-13.129 0.51172-2.2148 2.5-3.8672 4.8711-3.8672zm4.543 8.0898c-0.79297 1.7188-2.5273 2.9102-4.543 2.9102h-20c-2.0156 0-3.75-1.1914-4.543-2.9102-3.2383 1.6523-5.457 5.0195-5.457 8.9062v7h40v-7c0-3.8867-2.2188-7.2539-5.457-8.9062z'
				fill={active ? `url(#${gradientId})` : 'currentColor'}
				fillRule='evenodd'
				className={clsx(active && 'PlayModeBucketIcon__path--active')}
			/>
		</svg>
	);
}

type PlayModeIconProps = {
	mode: GameMode;
	selected?: boolean;
};

/** Mode glyph for play mode cards (Poison favicon or bucket). */
export function PlayModeIcon({ mode, selected = false }: PlayModeIconProps) {
	return (
		<span
			className={clsx(
				'PlayModeIcon flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-[background-color,box-shadow] duration-200',
				selected
					? mode === 'bucketTrainer'
						? 'PlayModeIcon--selected PlayModeIcon--bucket bg-[color-mix(in_oklch,var(--color-brand-gradient-a)_14%,var(--color-surface))] shadow-[0_0_0_1px_color-mix(in_oklch,var(--color-brand-gradient-a)_28%,transparent)]'
						: 'PlayModeIcon--selected PlayModeIcon--poison bg-[color-mix(in_oklch,var(--color-brand-gradient-b)_18%,var(--color-surface))] shadow-[0_0_0_1px_color-mix(in_oklch,var(--color-brand-gradient-b)_30%,transparent)]'
					: 'bg-white/70 text-dark',
			)}
			aria-hidden
		>
			{mode === 'bucketTrainer' ? (
				<PlayModeBucketIcon
					active={selected}
					className={clsx(
						'PlayModeIcon__glyph block h-8 w-8',
						!selected && 'PlayModeIcon__glyph--muted',
					)}
				/>
			) : (
				<img
					src='/favicon-32x32.png'
					alt=''
					decoding='async'
					className={clsx(
						'PlayModeIcon__glyph PlayModeIcon__glyph--poison block h-8 w-8',
						!selected && 'PlayModeIcon__glyph--muted',
					)}
				/>
			)}
		</span>
	);
}
