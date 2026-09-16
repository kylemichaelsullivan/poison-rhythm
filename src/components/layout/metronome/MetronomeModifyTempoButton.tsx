import clsx from 'clsx';
import MinusIcon from '@/assets/svg/minus.svg?react';
import PlusIcon from '@/assets/svg/plus.svg?react';
import { Icon } from '@/components/layout/Icon';
import {
	focusVisibleRingClassName,
	modifyTempoButtonClassName,
	sideGutterControlClassName,
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
				'ModifyTempoButton',
				modifyTempoButtonClassName,
				sideGutterControlClassName(isDecrease ? 'start' : 'end'),
				focusVisibleRingClassName,
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
