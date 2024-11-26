import { SearchParam } from './SearchParam.js';

/**
 * Factory function for `SearchParam`
 *
 * @param {string} key The `?:key` in `location.search`
 * @param {string} fallbackValue Optional fallback value
 * @param {Function} onChange Optional callback for change events
 * @param {object} options
 * @param {AbortSignal} [signal] `AbortSignal` to remove the listener when aborted
 * @param {boolean} [passive=false] A boolean value indicating that the listener should be invoked at most once after being added
 * @param {boolean} [once=false] A boolean value that, if true, indicates that the function specified by listener will never call `preventDefault()`.
 * @returns {SearchParam} An instance of a `SearchParam` object, dispatching a `change` event when changed
 */
export function getSearch(key, fallbackValue, onChange, { signal, passive = false, once = false } = {}) {
	if (onChange instanceof Function) {
		const param = new SearchParam(key, fallbackValue);
		param.addEventListener('change', onChange, { signal, passive, once });
		return param;
	} else {
		return new SearchParam(key, fallbackValue);
	}
}

/**
 * Manages a specified URL search parameter as a live-updating stateful value.
 *
 * @param {string} key - The name of the URL search parameter to manage.
 * @param {string|number} [fallbackValue=''] - The initial/fallback value if the search parameter is not set.
 * @returns {[SearchParam, function(string|number): void]} - Returns a two-element array:
 * - Returns a two-element array:
 *   - The first element is an object with:
 *     - A `toString` method, returning the current value of the URL parameter as a string.
 *     - A `[Symbol.toPrimitive]` method, allowing automatic conversion of the value based on the context (e.g., string or number).
 *   - The second element is a setter function that updates the URL search parameter to a new value, reflected immediately in the URL without reloading the page.
 */
export function manageSearch(key, fallbackValue = '', onChange, { signal, passive, once } = {}) {
	const param = getSearch(key, fallbackValue, onChange, { once, passive, signal });

	return [
		param,
		(newValue, { method = 'replace', cause = null } = {}) => {
			const url = new URL(globalThis?.location?.href);
			const oldValue = url.searchParams.get(key);
			url.searchParams.set(key, newValue);

			const event = new CustomEvent('change', {
				cancelable: true,
				detail: { name: key, newValue, oldValue, method, url, cause },
			});

			param.dispatchEvent(event);

			if (event.defaultPrevented) {
				return;
			} else if (method === 'replace') {
				history.replaceState(history.state, '', url.href);
			} else if (method === 'push') {
				history.pushState(history.state, '', url.href);
			} else {
				throw new TypeError(`Invalid update method: ${method}.`);
			}
		}
	];
}
