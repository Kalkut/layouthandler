var http = require('http'), fs = require('fs');

var serveur =  http.createServer(function (req,res) {
	
	if (req.url === '/') {
		res.writeHead(200);
		res.end('Hello');
	}
	else if (req.url.split(".")[1] === 'html') {
		res.writeHead(200);
		fs.readFile("." + req.url.split(".")[0] + ".html", function (err, data) {
			if (err) throw err;
			res.end(data);
		})
	}
	else if (req.url.split(".")[1] === 'js') {
		//console.log(req.url.split(".")[0]);
		fs.readFile('libs' + req.url.split(".")[0]  +".js", function (err, data) {
			if (err) throw err;
			res.end(data);
			console.log(req.url.split(".")[0]);
		})
	}
	else if (req.url.split(".")[1] === 'css') {
		//console.log(req.url.split(".")[0]);
		fs.readFile('style' + req.url.split(".")[0]  +".css", function (err, data) {
			if (err) throw err;
			res.end(data);
			console.log(req.url.split(".")[0]);
		})
	}
	else if (req.url.split(".")[1] === 'png') {
		//console.log(req.url.split(".")[0]);
		fs.readFile('img' + req.url.split(".")[0]  +".png", function (err, data) {
			if (err) throw err;
			res.end(data);
			console.log(req.url.split(".")[0]);
		})
	}
	else if (req.url.split(".")[1] === 'jpg') {
		//console.log(req.url.split(".")[0]);
		fs.readFile('img' + req.url.split(".")[0]  +".jpg", function (err, data) {
			if (err) throw err;
			res.end(data);
			console.log(req.url.split(".")[0]);
		})
	}
	else if (req.url.split(".")[1] === 'gif') {
		//console.log(req.url.split(".")[0]);
		fs.readFile('img' + req.url.split(".")[0]  +".gif", function (err, data) {
			if (err) throw err;
			res.end(data);
			console.log(req.url.split(".")[0]);
		})
	}
	else if (req.url.split(".")[1] === 'json') {
		res.writeHead(200,{"Content-Type": "text/json"})
		res.write(fs.readFileSync("." + req.url.split(".")[0]  +".json"))
		res.end();
	}	
	else {
		res.writeHead(404);
		res.end('Not found');
	}
});


serveur.listen(8000);