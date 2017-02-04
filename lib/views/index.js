'use strict';
const fs = require('fs');

class Views {
	constructor () {
		this.store = {};
	}
	send (name = null, data = {}) {
		if (this.store[name] === undefined) {
			return this.load(name);
		} else {
			return this.render(name, data);
		}
	}
	load (name) {
		this.store[name] = fs.readFileSync(`./views/${name}.html`, 'utf8');
		return this.render(name);
	}
	//TODO: 
	render (name, data) {
		const raw = this.store[name];
		return `${raw}`;
	}
}

module.exports = Views;