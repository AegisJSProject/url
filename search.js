import { SearchParam } from './SearchParam.js';
import { SearchParamChangeEvent } from './event.js';

/**
 *
 * @param {SearchParam} param
 * @returns {ProxyHandler<SearchParam>}
 */
function _getProxy(param) {
	return new Proxy(param, {
		get(target, prop) {
			if (prop === 'addEventListener') {
				return target.addEventListener.bind(target);
			} else if (prop === 'dispatchEvent') {
				return target.dispatchEvent.bind(target);
			} else {
				const val = target[SearchParam.valueSymbol];

				if (typeof val === 'string') {
					return val[prop] instanceof Function ? val[prop].bind(val) : val[prop];
				} else {
					return Reflect.get(target[SearchParam.valueSymbol], prop, target[SearchParam.valueSymbol]);
				}
			}
		},
		has(target, prop) {
			return Reflect.has(target[SearchParam.valueSymbol], prop);
		},
		ownKeys(target) {
			return Reflect.ownKeys(target[SearchParam.valueSymbol]);
		},
		isExtensible(target) {
			return Reflect.isExtensible(target);
		},
		preventExtensions(target) {
			return Reflect.preventExtensions(target);
		},
		getOwnPropertyDescriptor(target, prop) {
			return Reflect.getOwnPropertyDescriptor(target[SearchParam.valueSymbol], prop);
		}
	});
}

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
export function getSearch(key, fallbackValue, {
	onChange,
	onBeforeChange,
	multiple = false,
	signal,
	passive = false,
	once = false,
	proxy = true,
} = {}) {
	const param = new SearchParam(key, fallbackValue, { multiple });

	if (onChange instanceof Function) {
		param.addEventListener('change', onChange, { signal, passive, once });
	}

	if (onBeforeChange instanceof Function) {
		param.addEventListener('beforechange', onBeforeChange, { signal, passive, once });
	}

	return proxy ? _getProxy(param) : param;
}

export function setSearch(key, newValue, {
	method = 'replace',
	cause = null,
	multiple = false,
	fallbackValue = '',
	param,
} = {}) {
	const url = new URL(globalThis?.location?.href);
	const oldValue = multiple ? url.searchParams.getAll(key) : url.searchParams.get(key) ?? fallbackValue;

	if (multiple && typeof newValue === 'object' && newValue[Symbol.iterator] instanceof Function) {
		url.searchParams.delete(key);

		for (const val of newValue) {
			url.searchParams.append(key, val);
		}
	} else if (typeof newValue === 'undefined') {
		url.searchParams.delete(key);
	} else {
		url.searchParams.set(key, newValue);
	}

	if (param instanceof SearchParam) {
		const detail = Object.freeze({ name: key, newValue, oldValue, method, url, cause });
		const event = new SearchParamChangeEvent('beforechange', { cancelable: true, detail });

		param.dispatchEvent(event);

		if (event.defaultPrevented) {
			return;
		} else if (method === 'replace') {
			history.replaceState(history.state, '', url.href);

			param.dispatchEvent(new SearchParamChangeEvent('change', { cancelable: false, detail }));
		} else if (method === 'push') {
			history.pushState(history.state, '', url.href);

			param.dispatchEvent(new SearchParamChangeEvent('change', { cancelable: false, detail }));
		} else {
			throw new TypeError(`Invalid update method: ${method}.`);
		}
	} else if (method === 'replace') {
		history.replaceState(history.state, '', url.href);
	} else if (method === 'push') {
		history.pushState(history.state, '', url.href);
	} else {
		throw new TypeError(`Invalid update method: ${method}.`);
	}
}

/**
 * Manages search parameters in the URL with custom behavior for changes and updates.
 *
 * @param {string} key - The name of the search parameter to manage.
 * @param {string|Array} [fallbackValue=''] - The default value to use if the parameter is not present.
 * @param {Object} [options={}] - Optional configuration for managing the search parameter.
 * @param {boolean} [options.multiple=false] - Whether the parameter supports multiple values.
 * @param {AbortSignal} [options.signal] - An AbortSignal to cancel ongoing operations.
 * @param {boolean} [options.passive] - If true, changes to the parameter are not actively managed.
 * @param {boolean} [options.once] - If true, the parameter management is only performed once.
 * @returns {[Proxy<string | string[]>, function(newValue: *, options?: { method?: 'replace' | 'push', cause?: * }): void]} - An array containing two elements:
 *   - A `Proxy` object that interacts with the search parameter's value.
 *   - A function to update the search parameter, accepting a new value and options.
 *     - @param {*} newValue - The new value to set for the search parameter.
 *     - @param {Object} [updateOptions={}] - Options for the update operation.
 *       - @param {'replace'|'push'} [updateOptions.method='replace'] - How to update the browser history.
 *       - @param {*} [updateOptions.cause=null] - Additional context or reason for the update.
 * @throws {TypeError} - Throws if an invalid update method is provided.
 */
export function manageSearch(key, fallbackValue = '', {
	multiple = false,
	signal,
	passive,
	once,
} = {}) {
	const param = getSearch(key, fallbackValue, { proxy: false, multiple, once, passive, signal });

	return [
		_getProxy(param),
		(newValue, { method = 'replace', cause = null } = {}) => setSearch(key, newValue, { method, cause, multiple, fallbackValue, param }),
	];
}
