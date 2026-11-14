import { Section } from '@/components/layout';
import { PlayModeOptionList } from './PlayModeOptionList';

/** About-modal Play Mode section — Classic / Bucket switch. */
export function PlayModeFramedBlock() {
	return (
		<Section title='Play Mode'>
			<PlayModeOptionList />
		</Section>
	);
}
