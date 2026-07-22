import { Icon, type SvgIconComponent } from '@/components/layout/Icon';
import { segmentControlClassName } from '@/lib/control-classes';

export type SegmentOption<T> = {
	value: T;
	label: string;
	icon?: SvgIconComponent;
};

type SegmentButtonProps = {
	label: string;
	selected: boolean;
	onClick: () => void;
	/** Defaults to `selected`. Use when visual selection differs from `aria-pressed`. */
	pressed?: boolean;
	icon?: SvgIconComponent;
	title?: string;
	disabled?: boolean;
	grow?: boolean;
};

export function SegmentButton({
	label,
	selected,
	onClick,
	pressed = selected,
	icon,
	title = label,
	disabled = false,
	grow = true,
}: SegmentButtonProps) {
	return (
		<button
			type='button'
			className={segmentControlClassName(selected, { disabled, grow })}
			disabled={disabled}
			title={title}
			onClick={onClick}
			aria-label={label}
			aria-pressed={pressed}
		>
			{icon ? <Icon svg={icon} /> : label}
		</button>
	);
}
