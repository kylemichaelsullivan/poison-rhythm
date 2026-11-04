import { PoisonVisibilityToggle } from '@/components/layout/settings/PoisonVisibilityToggle';
import { DisplayModeTrigger } from './DisplayModeTrigger';
import type { RhythmRenderMode } from '@/lib/settings-schema';

type PoisonSectionHeaderProps =
	| {
			slot: 'leading';
	  }
	| {
			slot: 'action';
			renderMode: RhythmRenderMode;
			onOpenDisplayMode: () => void;
	  };

/** Poison section header control for a single `Section` slot. */
export function PoisonSectionHeader(props: PoisonSectionHeaderProps) {
	if (props.slot === 'leading') {
		return <PoisonVisibilityToggle showLabel={false} />;
	}

	return (
		<DisplayModeTrigger
			renderMode={props.renderMode}
			onClick={props.onOpenDisplayMode}
		/>
	);
}
