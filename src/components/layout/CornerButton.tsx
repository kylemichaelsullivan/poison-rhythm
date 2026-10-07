import clsx from 'clsx';
import type { ReactNode } from 'react';
import SettingsIcon from '@/assets/svg/settings.svg?react';
import {
	controlButtonBaseClassName,
	cornerControlButtonClassName,
} from '@/lib/control-classes';
import { Icon, type SvgIconComponent } from './Icon';

export type CornerButtonTone = 'default' | 'muted';

type CornerButtonProps = {
	label: string;
	icon?: SvgIconComponent;
	/** Wider layout for icon + trailing content. Inferred when `children` are set. */
	expanded?: boolean;
	onClick?: () => void;
	/** Visual tone; `muted` uses a dashed mid border (e.g. muted metronome). */
	tone?: CornerButtonTone;
	/** Tooltip; defaults to `label`. */
	title?: string;
	/** Trailing content beside the icon (e.g. tempo readout). */
	children?: ReactNode;
};

const toneClassName: Record<CornerButtonTone, string | undefined> = {
	default: undefined,
	muted: 'border-dashed text-mid',
};

export function CornerButton({
	label,
	icon: IconSvg = SettingsIcon,
	expanded,
	onClick,
	tone = 'default',
	title,
	children,
}: CornerButtonProps) {
	const isExpanded = expanded ?? children != null;

	return (
		<button
			type='button'
			className={clsx(
				cornerControlButtonClassName,
				controlButtonBaseClassName,
				isExpanded && 'gap-2 px-2.5 w-auto',
				toneClassName[tone],
			)}
			title={title ?? label}
			aria-label={label}
			onClick={onClick}
		>
			<Icon svg={IconSvg} inline={isExpanded} />
			{children}
		</button>
	);
}
