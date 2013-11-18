// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var requestFullScreen = document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullscreen;
var FULLSCREEN_EVENT;
if(document.documentElement.requestFullscreen){
	FULLSCREEN_EVENT = "fullscreenchange";
}else if(document.documentElement.mozRequestFullScreen){
	FULLSCREEN_EVENT = "mozfullscreenchange";
}else if(document.documentElement.webkitRequestFullscreen){
    FULLSCREEN_EVENT = "webkitfullscreenchange";
}

var isFullscreen = function(){
	if(document.documentElement.requestFullscreen){
		return document.fullscreen;
	}else if(document.documentElement.mozRequestFullScreen){
		return document.mozFullScreen;
	}else if(document.documentElement.webkitRequestFullscreen){
	    return document.webkitIsFullScreen;
	}
};