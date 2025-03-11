const importmap = JSON.stringify({
	imports: {
		'@shgysk8zer0/polyfills': '/node_modules/@shgysk8zer0/polyfills/browser.min.js',
		'@aegisjsproject/url/': '../',
		'@aegisjsproject/': 'https://unpkg.com/@aegisjsproject/',
	}
});

const integrity = await crypto.subtle.digest('SHA-384', new TextEncoder().encode(importmap))
	.then(hash => 'sha384-' + new Uint8Array(hash).toBase64());

const document = String.dedent`
	<!DOCTYPE html>
	<html lang="en" dir="ltr">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width" />
			<meta name="color-scheme" content="light dark" />
			<title>@aegisjsproject/url</title>
			<script type="importmap" integrity="${integrity}">${importmap}</script>
			<script type="module" src="./index.js" referrerpolicy="no-referrer"></script>
		</head>
		<body></body>
	</html>
`;

export default () => new Response(document, {
	headers: {
		'Content-Type': 'text/html',
		'Content-Security-Policy': [
			'default-src \'none\'',
			`script-src 'self' '${integrity}' https://unpkg.com/@aegisjsproject/`,
		].join('; '),
	}
});
