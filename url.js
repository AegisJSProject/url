import { stringify } from './utils.js';

export function escape(str) {
	return encodeURIComponent(stringify(str).trim()).replaceAll('..%2F', '%2E%2E%2F').replaceAll('.%2F', '%2E%2E%2F');
}

export function url(strings, base, ...values) {
	if (base instanceof Blob && strings.length === 2 && strings[0] === '' && strings[1] === '') {
		return new URL(URL.createObjectURL(base));
	} else if (URL.canParse(base)) {
		return URL.parse(String.raw(strings, '', ...values.map(escape)), base);
	} else {
		return URL.parse(String.raw(strings, escape(base), ...values.map(escape)));
	}
}
