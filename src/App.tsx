import { Body, Footer, Header } from '@/components/layout';
import { usePoisonGame } from '@/hooks/usePoisonGame';

function App() {
	const { poisonRhythm, measures, handleNewPoison, handleReusePoison } =
		usePoisonGame();

	return (
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
	);
}

export default App;
