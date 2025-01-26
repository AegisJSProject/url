import { describe, test } from 'node:test';
import { ok, strictEqual, deepStrictEqual, throws, doesNotReject, rejects } from 'node:assert';
import { manageSearch } from './search.js';

describe('Test `manageSearch()` functionality', () => {
	// Need to polyfill parts of `location` and `history` APIs for node.
	globalThis.location = new URL(import.meta.url);
	globalThis.history = {
		state: null,
		replaceState(state, unused, url) {
			this.state = state;
			globalThis.location = new URL(url, location);
		}
	};

	test('Test basic functionality', async () => {
		const [param, setParam] = manageSearch('test');
		const signal = AbortSignal.timeout(1);
		ok(param.addEventListener instanceof Function, 'Should support event listeners.');

		const promise = new Promise((resolve, reject) => {
			signal.addEventListener('abort', ({ target }) => reject(target.reason), { once: true });
			param.addEventListener('change', resolve, { signal, once: true });
		});

		doesNotReject(() => promise, 'Events should dispatch.');
		setParam('works');
		setParam(undefined);
	});

	test('Assure rejections work', async () => {
		const [param] = manageSearch('test');
		const signal = AbortSignal.timeout(1);

		const promise = new Promise((resolve, reject) => {
			signal.addEventListener('abort', ({ target }) => reject(target.reason), { once: true });
			param.addEventListener('change', resolve, { signal });
		});

		rejects(() => promise, 'Events should dispatch.');
	});

	test('Test single string params', () => {
		const [name, setName] = manageSearch('name', '');
		strictEqual(name.length, 0, 'Should proxy to underlying string length.');
		setName('Fred');
		ok(name.substring instanceof Function, 'Methods of params should be proxied to values.');
		strictEqual(name.substring(0), 'Fred', 'Updating param should update the value.');
		strictEqual(name.length, 4, 'Updating param should update the value length.');
		strictEqual(location.search, '?name=Fred', 'Should update location correctly.');
		setName(undefined);
		strictEqual(location.search.length, 0, 'Setting no/empty values should remove the search param.');
	});

	test('Test arrays and multiple values.', () => {
		const [list, setList] = manageSearch('list', [], { multiple: true });
		strictEqual(list.length, 0, 'Should start off with a length of 0');
		setList(['one', 'two', 'three']);
		deepStrictEqual(list.map(item => item.toUpperCase()), ['ONE', 'TWO', 'THREE'], 'Should expose underlying methods of array.');
		setList([...list, 'four']);
		throws(() => list.push('five'), { name: 'TypeError' }, 'Params should be immutable.');
		strictEqual(list.length, 4, 'Should implement the iterator protocol and spread syntax, updating values.');
		strictEqual(location.search, '?list=one&list=two&list=three&list=four', 'Should update the `list` search param with multiple values.');
		setList([]);
		strictEqual(location.search.length, 0, 'Setting no/empty values should remove the search param.');
	});
});
