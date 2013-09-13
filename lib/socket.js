module.exports = exports = function(io, slides, config){

	var state = {
		"numSlides": slides.length,
		"currentSlide": 1,
		"blackout": false,
	};
	
	/* These functions don't require a socket in scope to call, so define once, use many times */
	var toggleBlackout = function(){
		state.blackout = !state.blackout;
		io.sockets.emit('state', state);
	};
	
	var moveSlide = function(targetSlide){
		if(targetSlide > 0 && targetSlide <= state.numSlides){
			currentSlide = targetSlide;
			io.sockets.emit('state', state);
		}
	};
	
	var gotoSlide = function(data){
		var targetSlide = parseInt(data.slide);
		if(!isNaN(targetSlide)){
			moveSlide(targetSlide);
		}
	};
	
	var nextSlide = function(){
		moveSlide(state.currentSlide + 1);
	};
	
	var prevSlide = function(){
		moveSlide(state.currentSlide - 1);
	};

	io.sockets.on('connection', function(socket){
		socket.emit('state', state);
		
		socket.on('auth',function(data){
			if(data.password && data.password == config.slide_password){
				socket.removeAllListeners('auth');
				socket.on('next_slide', nextSlide);
				socket.on('prev_slide', prevSlide);
				socket.on('goto_slide', gotoSlide);
				socket.on('toggle_blackout', toggleBlackout);
			}
		});
	});
};