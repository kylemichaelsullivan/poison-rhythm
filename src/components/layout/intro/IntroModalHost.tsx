import { IntroModal } from './IntroModal';
import { useIntroTutorial } from './IntroTutorialContext';

/** App-level host: first-visit welcome, or replay from Settings. */
export function IntroModalHost() {
	const { open, closeIntro } = useIntroTutorial();

	return <IntroModal open={open} onClose={closeIntro} />;
}
