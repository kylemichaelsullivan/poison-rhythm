/** Single Guitar Hero–style note gem on the highway. */
export function ScrollHighwayNote() {
	return (
		<div
			className='ScrollHighwayNote size-4 rounded-full border-2 border-primary bg-primary shadow-soft'
			title='Hit'
			aria-hidden='true'
		/>
	);
}

export const SCROLL_HIGHWAY_GEM_PX = 16;
