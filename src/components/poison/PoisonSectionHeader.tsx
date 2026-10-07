import { PoisonVisibilityToggle } from '@/components/layout/settings/PoisonVisibilityToggle';
import type { RhythmRenderMode } from '@/lib/settings-schema';
import { DisplayModeTrigger } from './DisplayModeTrigger';

type PoisonSectionHeaderProps =
	| {
			slot: 'leading';
			poisonVisible: boolean;
			visibilityDisabled: boolean;
			onPoisonVisibleChange: (visible: boolean) => void;
	  }
	| {
			slot: 'action';
			renderMode: RhythmRenderMode;
			onOpenDisplayMode: () => void;
	  };

/** Poison section header control for a single `Section` slot. */
export function PoisonSectionHeader(props: PoisonSectionHeaderProps) {
	if (props.slot === 'leading') {
		return (
			<PoisonVisibilityToggle
				visible={props.poisonVisible}
				showLabel={false}
				disabled={props.visibilityDisabled}
				onChange={props.onPoisonVisibleChange}
			/>
		);
	}

	return (
		<DisplayModeTrigger
			renderMode={props.renderMode}
			onClick={props.onOpenDisplayMode}
		/>
	);
}
