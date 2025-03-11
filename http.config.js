export default {
	open: true,
	port: 8024,
	pathname: '/static/',
	routes: {
		'/static/': import.meta.resolve('./api/home.js'),
	},
};
