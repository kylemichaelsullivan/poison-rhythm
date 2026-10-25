import clsx from 'clsx';
import MinusIcon from '@/assets/svg/minus.svg?react';
import PlusIcon from '@/assets/svg/plus.svg?react';
import { Icon } from '@/components/layout/Icon';
import { useMetronomeTempo } from '@/contexts';
import {
	focusVisibleRingClassName,
	modifyTempoButtonClassName,
	sideGutterInFlowCollapseClassName,
} from '@/lib/control-classes';
import { BPM_MAX, BPM_MIN } from '@/lib/metronome-defaults';
import {
	decrementTempoByStep,
	incrementTempoByStep,
} from '@/lib/metronome-tempo';

type MetronomeModifyTempoButtonProps = {
	direction: 'decrease' | 'increase';
};

/**
 * In-flow beside the control surface when the modal has room; drops to the
 * bottom corners below `--breakpoint-gutter` (absolute, so it leaves the
 * flex row). Tempo context only (not beat flash).
 */
export function MetronomeModifyTempoButton({
	direction,
}: MetronomeModifyTempoButtonProps) {
	const { tempo, handleTempoChange } = useMetronomeTempo();
	const isDecrease = direction === 'decrease';
	const label = isDecrease ? 'Decrease Tempo' : 'Increase Tempo';

	return (
		<button
			type='button'
			className={clsx(
				'ModifyTempoButton shrink-0',
				modifyTempoButtonClassName,
				focusVisibleRingClassName,
				sideGutterInFlowCollapseClassName(isDecrease ? 'start' : 'end'),
			)}
			title={label}
			disabled={isDecrease ? tempo <= BPM_MIN : tempo >= BPM_MAX}
			onClick={() =>
				handleTempoChange(
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
