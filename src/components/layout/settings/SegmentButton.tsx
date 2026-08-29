import { Icon, type SvgIconComponent } from '@/components/layout/Icon';
import {
	type SegmentControlVariant,
	segmentControlClassName,
} from '@/lib/control-classes';

export type SegmentIcon = {
	id: string;
	icon: SvgIconComponent;
};

export type SegmentOption<T> = {
	value: T;
	label: string;
	icon?: SvgIconComponent;
	icons?: readonly SegmentIcon[];
};

type SegmentButtonProps = {
	label: string;
	selected: boolean;
	onClick: () => void;
	/** Defaults to `selected`. Use when visual selection differs from `aria-pressed`. */
	pressed?: boolean;
	icon?: SvgIconComponent;
	icons?: readonly SegmentIcon[];
	title?: string;
	disabled?: boolean;
	grow?: boolean | 'auto';
	variant?: SegmentControlVariant;
	className?: string;
};

export function SegmentButton({
	label,
	selected,
	onClick,
	pressed = selected,
	icon,
	icons,
	title = label,
	disabled = false,
	grow = true,
	variant = 'segment',
	className,
}: SegmentButtonProps) {
	const iconNodes =
		icons && icons.length > 0 ? (
			<span className='flex items-center gap-1'>
				{icons.map(({ id, icon: svg }) => (
					<Icon key={id} svg={svg} />
				))}
			</span>
		) : icon ? (
			<Icon svg={icon} />
		) : variant === 'checkbox' ? (
			<span aria-hidden='true' className='block aspect-square w-5 h-5' />
		) : (
			label
		);

	return (
		<button
			type='button'
			className={segmentControlClassName(selected, {
				disabled,
				grow,
				variant,
				className,
			})}
			disabled={disabled}
			title={title}
			onClick={onClick}
			aria-label={label}
			aria-pressed={pressed}
		>
			{iconNodes}
		</button>
	);
}
