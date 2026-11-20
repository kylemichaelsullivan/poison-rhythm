import { AboutCommitLink } from './AboutCommitLink';

type AboutBrandHeaderProps = {
	commitSha: string;
	commitUrl: string;
};

/** Brand block for the About modal: icon, title and hover-armed commit chip. */
export function AboutBrandHeader({
	commitSha,
	commitUrl,
}: AboutBrandHeaderProps) {
	return (
		<div className='AboutBrandHeader flex flex-col items-center gap-3 pt-1'>
			<img
				src='/apple-touch-icon.png'
				alt=''
				width={72}
				height={72}
				draggable={false}
				className='size-18 rounded-xl'
			/>
			<h2 className='AppTitleBrand text-2xl font-bold tracking-tight'>
				Poison Rhythm
			</h2>
			<AboutCommitLink commitSha={commitSha} commitUrl={commitUrl} />
		</div>
	);
}
