import { PoisonVisibilityToggle } from '@/components/layout/settings/PoisonVisibilityToggle';
import type { RhythmRenderMode } from '@/lib/settings-schema';
import { DisplayModeTrigger } from './DisplayModeTrigger';

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
