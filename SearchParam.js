const valueSymbol = Symbol('param:value');
const nameSymbol = Symbol('param:name');

/**
 * Class representing a URL search parameter accessor.
 * Extends `EventTarget` to support listening for updates on the parameter.
 */
export class SearchParam extends EventTarget {
	#name;
	#multiple = false;
	#fallbackValue = '';

	/**
	 * Creates a search parameter accessor.
	 * @param {string} name - The name of the URL search parameter to manage.
	 * @param {string|number|Array} fallbackValue - The default value if the search parameter is not set. An array if `multiple` is true.
	 */
	constructor(name, fallbackValue, { multiple = false } = {}) {
		super();
		this.#name = name;
		this.#fallbackValue = multiple && ! Array.isArray(fallbackValue) ? Object.freeze([fallbackValue]) : Object.freeze(fallbackValue);
		this.#multiple = multiple === true;
	}

	toString() {
		return this[SearchParam.valueSymbol];
	}

	[Symbol.iterator]() {
		return this.#multiple ? this[valueSymbol] : [this[valueSymbol]];
	}

	get [Symbol.toStringTag]() {
		return 'SearchParam';
	}

	[Symbol.toPrimitive](hint = 'default') {
		return hint === 'number' ? parseFloat(this[valueSymbol]) : this[valueSymbol];
	}

	get [valueSymbol]() {
		const params = new URLSearchParams(globalThis?.location.search);

		if (this.#multiple) {
			const values = Object.freeze(params.getAll(this.#name));
			return values.length === 0 ? this.#fallbackValue : values;
		} else {
			return params.get(this.#name) ?? this.#fallbackValue?.toString() ?? '';
		}
	}

	get [nameSymbol]() {
		return this.#name;
	}

	static get nameSymbol() {
		return nameSymbol;
	}

	static get valueSymbol() {
		return valueSymbol;
	}
}
