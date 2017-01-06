console.log('Server starting...');

var restify = require('restify'),
	server,
	port = process.env.PORT || 8080,
	index;

index = function (req, res, next) {
	'use strict';
	res.end(view.send('index'));
	return next();
};

server = restify.createServer({
	name: 'yardsale',
	version: '0.0.1'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: true }));
server.use(restify.authorizationParser());

//server.get(/\/static\/?.*/, restify.serveStatic({ directory : __dirname }));

server.get('/', index);

server.listen(port, function () {
	'use strict';
	console.log('%s listening at %s', server.name, server.url);
});