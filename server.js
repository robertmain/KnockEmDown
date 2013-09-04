var express = require('express'),
	cons = require('consolidate'),
	markdown = require('markdown').markdown,
	config = require('./config/config.js'),
	app = express(),
	fs = require('fs'),
	packageFile = require('./package.json'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	marked = require('marked');

var state = {};

marked.setOptions({
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartLists: true,
	langPrefix: 'language-',
	highlight: function(code, lang) {
		if (lang === 'js') {
			return highlighter.javascript(code);
		}
		return code;
	}
});

io.sockets.on('connection', function(socket){
	io.sockets.emit('state', state);
	socket.on('next_from_remote', function(){
		socket.broadcast.emit('next_slide');
	});
	socket.on('previous_from_remote', function(){
		socket.broadcast.emit('previous_slide');
	});
	socket.on('toggle_blackout_from_remote', function(){
		socket.broadcast.emit('toggle_blackout');
	});
	socket.on('slide_change', function(data){
		state.to = data.to;
		state.from = data.from;
		state.total_slides = data.total_slides;
		socket.broadcast.emit('slide_change_to_remote', data);
	});
});

app.configure(function() {
	app.engine('htm', cons.just);
	app.set('view engine', 'htm');
	app.set('views', __dirname + '/public');
	app.use(express.static("public"));
});

app.get("/", function(req, res) {
	var data = {};
	var markdownArray = fs.readFileSync('slides.md', {encoding: "utf8"}).split("\n\n\n");
	var markupArray = [];
	for(index in markdownArray){
		markupArray.push(marked(markdownArray[index]));
	}
	data.state = state;
	data.parsedSlides = markupArray;
	data.packageFile = packageFile;
	res.render("slides", data);
});

app.get("/remote", function(req, res){
	res.render('remote', packageFile);
});

server.listen(config.webserver.port);
console.log("Slide Server Now Running On " + config.webserver.ip + ":" + config.webserver.port + "...");