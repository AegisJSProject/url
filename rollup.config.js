import terser from '@rollup/plugin-terser';

export default [{
	input: 'url.js',
	output: [{
		file: 'url.cjs',
		format: 'cjs',
	}, {
		file: 'url.min.js',
		format: 'esm',
		sourcemap: true,
		plugins: [terser()],
	}],
}];
