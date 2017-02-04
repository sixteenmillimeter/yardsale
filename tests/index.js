'use strict'
const search = require('../lib/search.js')

search.records({Artist: "Nirvana"}, (err, results, response) => {
	if (err) {
		return console.error(err.Error[0].Message)
	}
	console.dir(results)
	console.dir(response)
})