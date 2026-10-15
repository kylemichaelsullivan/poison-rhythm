import tailwindcss from '@tailwindcss/postcss';
import iosColorFallback from './postcss/ios-color-fallback';

export default {
	plugins: [tailwindcss(), iosColorFallback()],
};
