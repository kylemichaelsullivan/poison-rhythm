import CheckmarkIcon from '@/assets/svg/checkmark.svg?react';
import { IconToggle } from '@/components/layout/settings';
import { Row } from '@/components/ui';
import { clickToTitle, enableActionLabel } from '@/lib/ui-copy';

type IntroSkipToggleProps = {
	checked: boolean;
	onChange: (checked: boolean) => void;
};

const DONT_SHOW_AGAIN = 'Don’t show again';

/** Opt in to hiding the welcome on this device. */
export function IntroSkipToggle({ checked, onChange }: IntroSkipToggleProps) {
	const action = enableActionLabel(checked);

	return (
		<Row justify='center' gap='2' fullWidth>
			<IconToggle
				label={`${DONT_SHOW_AGAIN}: ${action}`}
				title={
					checked
						? clickToTitle('Show Welcome Next Time')
						: clickToTitle('Hide Welcome Next Time')
				}
				pressed={checked}
				pressedIcon={CheckmarkIcon}
				variant='checkbox'
				size='sm'
				onPressedChange={onChange}
			/>
			<span className='text-sm font-semibold text-dark' aria-hidden>
				{DONT_SHOW_AGAIN}
			</span>
		</Row>
	);
}
