// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

function Player() {
};

Player.prototype.load = function(data, settings) {
	settings = settings || {};
	var self = this;
	var item = data;
	var time = 0;
	var videoStarting = true;

	
	if (item.VideoType && item.VideoType == "VideoFile") {				
		dom.append("body", {
			nodeName: "div",
			className: "player",
			id: "player",
			childNodes: [{
				nodeName: "video",
				className: "video",
				id: "video"
			    },{
					nodeName: "div",
					id: "video-controls",
					className: "video-controls",
					childNodes: [{
					    nodeName: "button",
					    className: "play",
					    id: "play-pause",
					    text: "Pause"
				    }, {
						nodeName: "button",
						className: "stop",
						id: "stop-exit",
						text: "Stop"
				    }, {
						nodeName: "button",
						className: "info-button",
						id: "info-button",
						text: "0:00/0:00"
				    }, {
					    nodeName: "input",
					    "type": "range",
					    className: "seek-bar",
					    id: "seek-bar",
					    "value": "0",
				    }]
			    }]
		});	
		var node = dom.querySelector("#video");
		node.setAttribute("crossorigin", "anonymous")
		node.setAttribute("webkit-playsinline","")
/*
		dom.append("#video", {
			nodeName: "source",
			src: emby.getVideoStreamUrl({
				itemId: item.Id,					
				extension: item.MediaSources[0].Container
			}),
			"type": mime.lookup(item.MediaSources[0].Container)
		});
*/	
		dom.append("#video", {
			nodeName: "source",
			src: emby.getVideoHlsStreamUrl({
				itemId: item.Id
			}),
			"type": mime.lookup("m3u8")
		});	

		var video = document.getElementById("video");		
		var playerRegion = document.getElementById("player");		
		var playButton = document.getElementById("play-pause");
		var stopButton = document.getElementById("stop-exit");
		var infoButton = document.getElementById("info-button");
		var seekBar = document.getElementById("seek-bar");

		
		video.addEventListener("playing", function(event) {
			if (prefs.resumeTicks > 0)
			{
				//get seconds from ticks
				var ts = prefs.resumeTicks / 10000000;
				prefs.resumeTicks = 0;

				//conversion based on seconds
				var hh = Math.floor( ts / 3600);
				var mm = Math.floor( (ts % 3600) / 60);
				var ss = Math.floor(  (ts % 3600) % 60);

				//prepend '0' when needed
				hh = hh < 10 ? '0' + hh : hh;
				mm = mm < 10 ? '0' + mm : mm;
				ss = ss < 10 ? '0' + ss : ss;

				//use it
				var str = hh + ":" + mm + ":" + ss;
				playerpopup.show({
					duration: 2000,
					text: "Resuming Playback at " + str
				});	
//				video.currentTime = Math.floor(ts)
			}
			
			time = Math.floor(event.target.currentTime);	
			var ticks = time * 10000000;

			emby.postSessionPlayingStarted({
				data: {
					ItemId: item.Id,
					MediaSourceId: item.Id,
					QueueableMediaTypes: "video",
					CanSeek: true,
					PositionTicks: ticks,
					PlayMethod: "DirectStream"
				}
			});
							
		});
		
		video.addEventListener("ended", function(event) {
			self.close();
		});
	
//		video.addEventListener("loadedmetadata", function(event) {
//
//		});

		video.addEventListener("timeupdate", function(event) {
			// update the time/duration and slider values
			var durhr = Math.floor(video.duration / 3600);
		    var durmin = Math.floor((video.duration % 3600) / 60);
			durmin = durmin < 10 ? '0' + durmin : durmin;
				
			var curhr = Math.floor(video.currentTime / 3600);
		    var curmin = Math.floor((video.currentTime % 3600) / 60);
			curmin = curmin < 10 ? '0' + curmin : curmin;

			infoButton.innerHTML = curhr+":"+curmin+"/"+durhr+ ":"+durmin; 
			seekBar.value = (100 / video.duration) * video.currentTime;

			if (Math.floor(video.currentTime) > time + 4) {
				time = Math.floor(event.target.currentTime);	
				var ticks = time * 10000000;
					
				emby.postSessionPlayingProgress({
					data: {
						ItemId: item.Id,
						MediaSourceId: item.Id,
						QueueableMediaTypes: "video",
						CanSeek: true,
						PositionTicks: ticks,
						PlayMethod: "DirectStream"
					}
				});
					

			}
		});
		video.onpause = function(event) {
			time = Math.floor(event.target.currentTime);	
			var ticks = time * 10000000;

			emby.postSessionPlayingProgress({
				data: {
					ItemId: item.Id,
					MediaSourceId: item.Id,
					QueueableMediaTypes: "video",
					CanSeek: true,
					PositionTicks: ticks,
					PlayMethod: "DirectStream",
					IsPaused: true
				}
			});
						
			console.log("Play Paused - " + time + " : " + ticks);
		};
		
		// Event listener for the play/pause button
		playButton.addEventListener("click", function() {
			if (video.paused == true) {
				// Play the video
				video.play();

				// Update the button text to 'Pause'
				playButton.innerHTML = "Pause";
			} else {
				// Pause the video
				video.pause();

				// Update the button text to 'Play '
				playButton.innerHTML = "Play";
			}
		});

		// Event listener for the stop button
		stopButton.addEventListener("click", function() {
			self.close();
		});

		// Event listener for the seek bar
		seekBar.addEventListener("change", function() {
			// Calculate the new time
			var time = video.duration * (seekBar.value / 100);

			// Update the video time
			video.currentTime = time;
		});

	
		// Pause the video when the seek handle is being dragged
		seekBar.addEventListener("mousedown", function() {
			video.pause();
			playButton.innerHTML = "Play";
		});

		// Play the video when the seek handle is dropped
		seekBar.addEventListener("mouseup", function() {
			video.play();
			playButton.innerHTML = "Pause";
		});

		video.addEventListener("mousemove",function(){
			self.showControls({duration: 6000});
		});
		
		video.load();
		video.play();			
	}
};

Player.prototype.close = function(event) {
//	clearInterval(this.interval)
	var video = document.getElementById("video");		
	time = Math.floor(video.currentTime);	
	var ticks = time * 10000000;

	emby.postSessionPlayingStopped({
		success: function(){emby.postActiveEncodingStop()},
		data: {
			ItemId: item.Id,
			MediaSourceId: item.Id,
			QueueableMediaTypes: "video",
			CanSeek: true,
			PositionTicks: ticks,
			PlayMethod: "DirectStream"
		}
	});	
	
 
    dom.remove("#player");	
	dom.remove("#video-controls");
   	
};

Player.prototype.skip = function() {
	var video = document.getElementById("video");
	video.currentTime += Math.floor(prefs.fwdSkip);
};

Player.prototype.backskip = function() {
	var video = document.getElementById("video");
	video.currentTime -= Math.floor(prefs.backSkip);
};

Player.prototype.play = function() {
	var video = document.getElementById("video");
	video.play();
	if (video.playbackRate != 1)
	    video.playbackRate = 1;
};
Player.prototype.pause = function() {
	var video = document.getElementById("video");
	video.pause();
};
Player.prototype.fastforward = function() {
	var video = document.getElementById("video");
	video.playbackRate += .5;
	
	playerpopup.show({
		duration: 1000,
		text: "Fast Forward " + video.playbackRate + "x"
	});	

};
Player.prototype.rewind = function() {
	var video = document.getElementById("video");
	if (video.playbackRate > 0)
		video.playbackRate = 0;
	video.playbackRate -= .5;
	playerpopup.show({
		duration: 1000,
		text: "Rewind " + video.playbackRate* -1 + "x"
	});	
};
Player.prototype.showControls = function(settings){
	var duration = settings.duration || 3000;
	var persist = settings.persist || false;

	window.clearTimeout(this.interval);
	dom.show("#video-controls");
	if (!persist)
    	this.interval = window.setTimeout(function() {
		   dom.hide("#video-controls");
	    }, duration);

};
Player.prototype.hideControls = function(){
	dom.hide("#video-controls");
};
