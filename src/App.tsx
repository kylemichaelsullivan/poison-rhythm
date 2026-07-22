import { AboutPoisonRhythmProvider, Body, Footer, Header } from '@/components/layout';
import { usePoisonGame } from '@/hooks';

function App() {
	const { poisonRhythm, measures, handleNewPoison, handleReusePoison } =
		usePoisonGame();

	return (
		<AboutPoisonRhythmProvider>
			<div className='flex min-h-screen flex-col items-center gap-6 bg-white text-black'>
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
