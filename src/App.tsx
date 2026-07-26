import clsx from 'clsx';
import {
	AboutPoisonRhythmProvider,
	Body,
	Footer,
	Header,
} from '@/components/layout';
import { usePoisonGame } from '@/hooks';
import { pageSurfaceClassName } from '@/lib/control-classes';

function App() {
	const { poisonRhythm, measures, handleNewPoison, handleReusePoison } =
		usePoisonGame();

	return (
		<AboutPoisonRhythmProvider>
			<div
				className={clsx(
					'flex min-h-dvh flex-col items-center gap-6',
					pageSurfaceClassName,
				)}
			>
				<Header />

				<Body
					poisonRhythm={poisonRhythm}
					measures={measures}
					onNewPoison={handleNewPoison}
					onReusePoison={handleReusePoison}
				/>

				<Footer />
			</div>
		</AboutPoisonRhythmProvider>
	);
}

export default App;
