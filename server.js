var express = require('express'),
	config = require('./config/config.js'),
	app = express(),
	packageFile = require('./package.json'),
	fs = require('fs'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
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
		"slides": slides,
	};
	require("./lib/routes.js")(app, templateData);
	require("./lib/socket.js")(io, slides, config);
});

app.get("/template", function(req, res){
	res.render('slide_template');
});

server.listen(config.webserver.port);
console.log(packageFile.name + " Server Now Running On " + config.webserver.ip + ":" + config.webserver.port + "...");