'use strict'
const pg = require('pg')
const squelRaw = require('squel')
const squel = squelRaw.useFlavour('postgres')
const moment = require('moment')

let client

class data {
	constructor (cb) {
		console.log('Connecting to database... ')
		pg.connect(process.env.DATABASE_URL, (err, c) => {
			if (err) {
				console.log('Error connecting to database:')
				throw err
			}
			console.log(`Connected to ${process.env.DATABASE_URL}`)
			client = c
			if (cb) cb()
		})
	}
}

module.exports = data