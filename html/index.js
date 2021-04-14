

var http = require('http');
var fs = require('fs');

http.createServer(
	function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/plain' });
		if (req.url == "/") {
			fs.readFile("indes.html", function (err, data) {
				res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
				res.end(data);
			});

		}
	}
).listen(3000);
console.log('origin test');


