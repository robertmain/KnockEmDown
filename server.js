var express = require('express'),
	config = require('./config/config.js'),
	ip = require('ip'),
	fs = require('fs'),
	app = express(),
	packageFile = require('./package.json'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	open = require('open'),
	handlebars = require('handlebars');

require('handlebars-layouts')(handlebars);

fs.readdirSync(config.directories.slide_templates).forEach(function(file) {
	var layout = fs.readFileSync(config.directories.slide_templates+"/"+file, {"encoding": "utf8"});
	handlebars.registerPartial(file, layout);
});

app.configure(function() {
	app.engine('htm', require('consolidate').handlebars);
	app.set('view engine', 'htm');
	app.set('views', 'lib/templates');
	app.use(express.static("public"));
});

require("./lib/slide-reader.js")(config.directories.slides, function(slides){ 
	var templateData = {
		"packageFile": packageFile,
		"config": config,
		"slides": slides.slides,
		"fragments": slides.fragments,
		"ip": ip.address()
	};
	require("./lib/routes.js")(app, templateData);
	require("./lib/socket.js")(io, slides, config);
});

app.get("/template", function(req, res){
	res.render('slide_template');
});

server.listen(config.webserver.port);
console.log(packageFile.name + " Server Now Running On " + ip.address() + ":" + config.webserver.port + "...");
open("http://localhost:" + config.webserver.port, 'chrome');