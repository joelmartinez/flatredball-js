self.addEventListener('message', function(e) {
	setInterval(function () {
		self.postMessage(null);    
	}, 1000 / e.data.fps);
}, false);