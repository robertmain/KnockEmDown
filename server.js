var express = require('express'),
	cons = require('consolidate'),
	config = require('./config/config.js'),
	app = express(),
	fs = require('fs'),
	packageFile = require('./package.json'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	marked = require('marked');

var state = {};
state.currentSlide = 0;
state.blackout = 0;
var markdownArray = fs.readFileSync('slides.md', {encoding: "utf8"}).split("\n\n\n");
var parsedSlides = [];
markdownArray.forEach(function(val, idx){
	parsedSlides.push(marked(val));
});

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
		if(!state.blackout){
			if(state.currentSlide < parsedSlides.length-1){
				state.currentSlide ++;
				io.sockets.emit('state', state);
			}
		}	
	});
	socket.on('previous_from_remote', function(){
		if(!state.blackout){			
			if(state.currentSlide > 0){
				state.currentSlide --;
				io.sockets.emit('state', state);
			}
		}
	});
	socket.on('toggle_blackout_from_remote', function(){
		if(state.blackout){
			state.blackout = 0;
		}
		else{
			state.blackout = 1;
		}
		io.sockets.emit('state', state);
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
	data.parsedSlides = parsedSlides;
	data.packageFile = packageFile;
	res.render("slides", data);
});

app.get("/remote", function(req, res){
	var data = {};
	data.packageFile = packageFile;
	data.parsedSlides = parsedSlides;
	res.render('remote', data);
});

server.listen(config.webserver.port);
console.log("Slide Server Now Running On " + config.webserver.ip + ":" + config.webserver.port + "...");