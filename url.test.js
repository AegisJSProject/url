import '@shgysk8zer0/polyfills';
import { describe, test } from 'node:test';
import assert from 'node:assert';
import { url } from './url.js';

describe('Verify URLs', () => {
	const isSameURL = (url, expected, msg) => assert.equal(url?.href, expected, msg);
	const signal = AbortSignal.timeout(300);
	const base = 'https://example.com';
	const unsafe = '../foo';
	const expected = 'https://example.com/%2E%2E%2Ffoo';

	test('Parsed URLs should be URLs', { signal }, () => {
		assert.ok(url`https://example.com` instanceof URL, 'Should parse to a URL object.');
	});

	test('Invalid URLs should be `null`', { signal }, () => {
		assert.equal(url`djkfgdfg`, null, 'Invalid URLs should result in `null`.');
	});

	test('Verify unsafe chars are escaped', { signal }, () => {
		isSameURL(url`https://example.com/${unsafe}`, expected, 'Unsafe chars should be escaped.');
	});

	test('Verify base is handled correctly', { signal }, () => {
		isSameURL(url`${base}/${unsafe}`, expected, 'Variable origin/hosts should be supported.');
	});

	test('Verify files are handled correctly', { signal }, () => {
		const file = new File(['Hello, World!'], 'hi.txt', { type: 'text/plain' });
		const result = url`${file}`;
		assert.equal(result?.protocol, 'blob:', 'Files/Blobs should result in `blob:` URIs.');
	});
});
