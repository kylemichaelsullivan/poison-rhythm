type AboutBrandHeaderProps = {
	version: string;
};

/** Brand block for the About modal: icon, title, and version. */
export function AboutBrandHeader({ version }: AboutBrandHeaderProps) {
	return (
		<div className='AboutBrandHeader flex flex-col items-center gap-3 pt-1'>
			<img
				src='/apple-touch-icon.png'
				alt=''
				width={72}
				height={72}
				className='size-18 rounded-xl'
			/>
			<h2 className='AppTitleBrand text-2xl font-bold tracking-tight'>
				Poison Rhythm
			</h2>
			<p className='text-sm text-muted tabular-nums'>Version {version}</p>
		</div>
	);
}
