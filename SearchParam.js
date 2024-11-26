/**
 * Class representing a URL search parameter accessor.
 * Extends `EventTarget` to support listening for updates on the parameter.
 */
export class SearchParam extends EventTarget {
	#name;
	#fallbackValue = '';

	/**
	 * Creates a search parameter accessor.
	 * @param {string} name - The name of the URL search parameter to manage.
	 * @param {string|number} fallbackValue - The default value if the search parameter is not set.
	 */
	constructor(name, fallbackValue) {
		super();
		this.#name = name;
		this.#fallbackValue = fallbackValue;
	}

	toString() {
		return this.#value;
	}

	get [Symbol.toStringTag]() {
		return 'SearchParam';
	}

	[Symbol.toPrimitive](hint = 'default') {
		return hint === 'number' ? parseFloat(this.#value) : this.#value;
	}

	get #value() {
		const params = new URLSearchParams(globalThis?.location.search);
		return params.get(this.#name) ?? this.#fallbackValue?.toString() ?? '';
	}
}
