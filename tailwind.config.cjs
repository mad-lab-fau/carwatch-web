/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	// Generate grid-cols-1 -> 12 to recognize dynamic classes in barcode label generation
	safelist: [...Array.from({ length: 12. }).fill('').map((_, i) => `grid-cols-${i + 1}`)],
	theme: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/forms'),
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
	],
}
