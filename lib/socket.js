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
			state.currentSlide = targetSlide;
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
	
	var bind = function(socket){
		socket.removeAllListeners('auth');
		socket.on('next_slide', nextSlide);
		socket.on('prev_slide', prevSlide);
		socket.on('goto_slide', gotoSlide);
		socket.on('toggle_blackout', toggleBlackout);
		socket.emit('auth_success', {});
	};

	io.sockets.on('connection', function(socket){
		socket.emit('state', state);
		if(config.presentation.control_password){
			socket.emit('auth_challenge', {});
			socket.on('auth',function(data){
				if(data.password && data.password == config.presentation.control_password){
					bind(socket);
				}else{
					socket.emit('auth_fail', {});
				}
			});
		}else{
			bind(socket);
		}
	});
};