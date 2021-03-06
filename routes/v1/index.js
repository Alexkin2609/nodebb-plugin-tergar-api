'use strict';
/* globals module, require */

var apiMiddleware = require('./middleware'),
	errorHandler = require('../../lib/errorHandler'),
	plugins = require.main.require('./src/plugins'),
	writeApi = module.parent.parent.exports;

module.exports = function (app, coreMiddleware) {
	app.use(function(req, res, next) {
		if (writeApi.settings.requireHttps === 'on' && req.protocol !== 'https') {
			res.set('Upgrade', 'TLS/1.0, HTTP/1.1');
			return errorHandler.respond(426, res);
		} else {
			next();
		}
	});

	app.use('/users', require('./users')(coreMiddleware));
	app.use('/groups', require('./groups')(coreMiddleware));

	app.get('/ping', function(req, res) {
		res.status(200).json({
			code: 'ok',
			message: 'pong',
			params: {}
		});
	});

	app.post('/ping', apiMiddleware.requireUser, function(req, res) {
		res.status(200).json({
			code: 'ok',
			message: 'pong, accepted test POST ping for uid ' + req.user.uid,
			params: {
				uid: req.user.uid
			}
		});
	});

	// This router is reserved exclusively for plugins to add their own routes into the write api plugin. Confused yet? :trollface:
	var customRouter = require('express').Router();
	plugins.fireHook('filter:plugin.tergar-api.routes', {
		router: customRouter,
		apiMiddleware: apiMiddleware,
		middleware: coreMiddleware,
		errorHandler: errorHandler
	}, function (err, payload) {
		app.use('/', payload.router);

		app.use(function(req, res) {
			// Catch-all
			errorHandler.respond(404, res);
		});
	});

	return app;
};
