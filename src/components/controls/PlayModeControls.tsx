import { PlayModeFramedBlock } from './PlayModeFramedBlock';
import { PlayModeOptionList } from './PlayModeOptionList';

type PlayModeControlsProps = {
	/**
	 * When true (default), bordered About section with mode badge.
	 * When false, compact Settings list only.
	 */
	framed?: boolean;
};

/**
 * Play Mode composer — independent of Difficulty. Option list binds globally
 * and regenerates the round when `gameMode` changes.
 */
export function PlayModeControls({ framed = true }: PlayModeControlsProps) {
	if (framed) {
		return <PlayModeFramedBlock />;
	}
	return <PlayModeOptionList />;
}
