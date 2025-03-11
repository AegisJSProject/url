import '@shgysk8zer0/polyfills';
import { manageSearch, getSearch, setSearch } from '@aegisjsproject/url/search.js';
import { html } from '@aegisjsproject/core/parsers/html.js';
import { attr } from '@aegisjsproject/core/stringify.js';
import { onChange, onSubmit, onReset, observeEvents } from '@aegisjsproject/callback-registry/events.js';
import { properties } from '@aegisjsproject/styles/properties.js';
import { baseTheme, lightTheme, darkTheme } from '@aegisjsproject/styles/theme.js';
import { forms } from '@aegisjsproject/styles/forms.js';
import { btn, btnSuccess, btnDanger } from '@aegisjsproject/styles/button.js';

const [query, setQuery] = manageSearch('q', '');

const params = getSearch('l', [], { multiple: true });
const list = ['a', 'b', 'c'];

query.addEventListener('change', console.log);
params.addEventListener('change', console.log);

document.adoptedStyleSheets = [properties, baseTheme, lightTheme, darkTheme, forms, btn, btnSuccess, btnDanger];

document.body.append(html`<form ${onSubmit}="${event => event.preventDefault()}" ${onReset}="${() => {
	setSearch('q', '');
	setSearch('l', [], { multiple: true });
}}">
	<fieldset>
		<legend>Search Test</legend>
		<div class="form-group">
			<label for="search" class="input-label">Query</label>
			<input type="search" name="q" id="search" class="input" ${attr({ value: query })} ${onChange}="${event => setQuery(event.target.value)}" required="" />
		</div>
		<div ${onChange}="${event => setSearch('l', [...event.target.form.elements.namedItem(event.target.name)].filter(input => input.checked).map(input => input.value), { multiple: true, fallbackValue: [], param: params, cause: event })}">
			${list.map(item => `<label>${item}<input type="checkbox" name="l" ${attr({ value: item, checked: params.includes(item) })} /></label>`).join('')}
		</div>
	</fieldset>
	<div>
		<button type="submit" class="btn btn-success">Submit</button>
		<button type="reset" class="btn btn-danger">Reset</button>
	</div>
</form>`);

observeEvents();
