import clsx from 'clsx';
import MinusIcon from '@/assets/svg/minus.svg?react';
import PlusIcon from '@/assets/svg/plus.svg?react';
import { Icon } from '@/components/layout/Icon';
import {
	focusVisibleRingClassName,
	modifyTempoButtonClassName,
} from '@/lib/control-classes';
import { BPM_MAX, BPM_MIN } from '@/lib/metronome-defaults';
import {
	decrementTempoByStep,
	incrementTempoByStep,
} from '@/lib/metronome-tempo';

type MetronomeModifyTempoButtonProps = {
	direction: 'decrease' | 'increase';
	tempo: number;
	onTempoChange: (value: number) => void;
};

/**
 * In-flow beside the control surface when the modal has room; drops to the
 * bottom corners below ~63rem (absolute, so it leaves the flex row).
 */
export function MetronomeModifyTempoButton({
	direction,
	tempo,
	onTempoChange,
}: MetronomeModifyTempoButtonProps) {
	const isDecrease = direction === 'decrease';
	const label = isDecrease ? 'Decrease Tempo' : 'Increase Tempo';

	return (
		<button
			type='button'
			className={clsx(
				'ModifyTempoButton shrink-0',
				modifyTempoButtonClassName,
				focusVisibleRingClassName,
				'max-[63rem]:absolute max-[63rem]:top-auto max-[63rem]:bottom-[var(--side-gutter-collapse-inset)] max-[63rem]:translate-y-0',
				isDecrease
					? 'max-[63rem]:right-auto max-[63rem]:left-[var(--side-gutter-collapse-inset)]'
					: 'max-[63rem]:left-auto max-[63rem]:right-[var(--side-gutter-collapse-inset)]',
			)}
			title={label}
			disabled={isDecrease ? tempo <= BPM_MIN : tempo >= BPM_MAX}
			onClick={() =>
				onTempoChange(
					isDecrease
						? decrementTempoByStep(tempo)
						: incrementTempoByStep(tempo),
				)
			}
			aria-label={label}
		>
			<Icon svg={isDecrease ? MinusIcon : PlusIcon} size='md' />
		</button>
	);
}
