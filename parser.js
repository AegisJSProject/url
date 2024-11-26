import { stringify } from './utils.js';

/**
 * Escapes a component of a URL, also protecting against path traversal
 *
 * @param {string} str
 * @returns {string} The URL-safe string
 */
export function escape(str) {
	return encodeURIComponent(stringify(str).trim()).replaceAll('..%2F', '%2E%2E%2F').replaceAll('.%2F', '%2E%2E%2F');
}

/**
 * Creates a URL parser tagged template with a custom base
 *
 * @param {string} [base=document.baseURI] Base to parse relative URLs from
 * @returns {Function} A URL parsing tagged template
 */
export function createURLParser(base = globalThis?.document?.baseURI) {
	return function url(strings, value, ...values) {
		if (value instanceof Blob && strings.length === 2 && strings[0] === '' && strings[1] === '') {
			return new URL(URL.createObjectURL(value));
		} else if (URL.canParse(value)) {
			return URL.parse(String.raw(strings, '', ...values.map(escape)), value);
		} else if (strings[0].startsWith('/')) {
			return URL.parse(String.raw(strings, escape(value), ...values.map(escape)), base);
		} else if (strings[0].startsWith('./') || strings[0].startsWith('../')) {
			return URL.parse(String.raw(strings, escape(value), ...values.map(escape)), base);
		} else {
			return URL.parse(String.raw(strings, escape(value), ...values.map(escape)));
		}
	};
}

/**
 * A function for creating URL objects from tagged template literals.
 *
 * @param {TemplateStringsArray} strings - The template string parts.
 * @param  {...any} args - The template string substitutions.
 * @returns {URL | null} - A URL object if the URL is valid, otherwise null.
 */
export const url = createURLParser();
