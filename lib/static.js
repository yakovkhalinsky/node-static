var fs = require('fs');
exports.options = {
	basePath : '',
	pathMatch : [ '/img', '/css', '/js', '/html' ],
	errorMessage : 'HTTP 404 Not Found',
	errorCallback : null,
	logging : false
}

function send(req, res, path) {
	if (this.logging) {
		console.log('GET:' + path);
	}
	fs.exists(path, function (exists) {
		if (exists) {
			fs.readFile(path, function (err, data) {
				if (err)  {
					exports.error(req, res, 404, exports.options.errorMessage);
					return;
				} else {
					res.writeHead(200);
				    res.end(data);
			 	    return;
				}
			});
		} else {
			exports.error(req, res, 404, exports.options.errorMessage);
			return;
		}
	});
}

exports.error = function(req, res, code, message) {
	if (undefined == message || null == message) {
		message = exports.options.errorMessage;
	}
	if (null != exports.options.errorCallback) {	// if we have a callback default for a not found error, use the callback
		exports.options.errorCallback(req, res, code, message);
		return;
	}
	if (exports.options.logging) {
		console.log(code + ': ' + message);
	}
	res.writeHead(code);
	res.end(message);
	return;
}

exports.init = function(initOptions) {
	if (initOptions.basePath) {
		exports.options.basePath = initOptions.basePath;
	} 
	if (initOptions.pathMatch) {
		exports.options.pathMatch = initOptions.pathMatch;
	}
	if (initOptions.errorMessage) {
		exports.options.errorMessage = initOptions.errorMessage; 
	}
	if (initOptions.errorCallback) {
		exports.options.errorCallback = initOptions.errorCallback; 
	}
	if (initOptions.logging) {
		exports.options.logging = initOptions.logging;
	}
	console.log('Initialising Static Files Warp Drive');
	console.log(exports.options);
	console.log('-DONE');
}

function isPathMatch(path) {	// check for supported static file path route match
	for (var i in exports.options.pathMatch) {
		if (path.indexOf(exports.options.pathMatch[i]) == 0) {
			return true;
		}
	}
	return false;
}

exports.serve = function(req, res) {
	if (isPathMatch(req.url)) {
		var path = exports.options.basePath + req.url;
		send(req, res, path);
	} else {
		exports.error(req, res, 404, exports.options.errorMessage);
	}
}