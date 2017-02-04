'use strict'
console.log('Server starting...')

const restify = require('restify')
const port = process.env.PORT || 8080
const Views = require('./lib/views')
const view = new Views()
let search
let server
let index

if (typeof process.env.AWS_ID !== 'undefined') {
	search = require('./lib/search')
}

index = (req, res, next) => {
	res.end(view.send('index'))
	return next()
};

server = restify.createServer({
	name: 'yardsale',
	version: '0.0.1'
});

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser({ mapParams: true }))
server.use(restify.authorizationParser())

server.get(/\/static\/?.*/, restify.serveStatic({ directory : __dirname }))

server.get('/', index)

server.listen(port, () => {
	console.log(`${server.name} listening at ${server.url}`)
});