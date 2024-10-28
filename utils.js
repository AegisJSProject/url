export function stringify(thing) {
	switch(typeof thing) {
		case 'string':
			return thing;

		case 'function':
			throw new TypeError('Functions are not supported.');

		case 'undefined':
			return '';

		case 'object':
			if (thing === null) {
				return '';
			} else if (thing instanceof Date) {
				return thing.toISOString();
			} else if (Array.isArray(thing)) {
				return thing.map(stringify).join(',');
			} else if (thing instanceof ArrayBuffer && Uint8Array.prototype.toBase64 instanceof Function) {
				return new Uint8Array(thing).toBase64();
			} else if (ArrayBuffer.isView(thing) && thing.toBase64 instanceof Function) {
				return thing.toBase64();
			} else if (thing instanceof Blob) {
				return URL.createObjectURL(thing);
			} else {
				return thing.toString();
			}

		default:
			return thing.toString();
	}
}
