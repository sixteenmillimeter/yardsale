var view = {},
	fs = require('fs');

view.store = {};

view.send = function (name) {
	'use strict';
	if (typeof view.store[name] === 'undefined') {
		return view.load(name);
	} else {
		return view.store[name];
	}
};

view.load = function (name) {
	'use strict';
	view.store[name] = fs.readFileSync('./views/' + name + '.html', 'utf8');
	return view.store[name];
};

module.exports = view;