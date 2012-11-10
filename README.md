node-static
===========

A simple to implement static file server for node.js

Example
===========

<pre><code>var http = require("http”);
var static = require("./lib/static.js”);

// An example custom function to deal with 404's returned by the static module
// You could use this to either provide a custom 404 or just fallback to other routes
function notFoundErrors(req, res, code, message) {
	console.log('running callback for not found errors:');
	console.log(code + ': ' + message);
	res.writeHead(code);
	res.end(message);
	return;
}

// initialise the static file server
static.init({
	basePath : './public',	// required
	pathMatch : [ '/img', '/css', '/js', '/html' ],	//optional
	errorMessage : '404 Not Found',	//optional
	errorCallback : notFoundErrors, 	//optional
	logging : true	// otpional
});

http.createServer(function (req, res) {
  static.serve(req, res);	// attempt to serve the static files
}).listen(1337);
</code></pre>