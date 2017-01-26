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
       if (prefs.directPlay == true)
        {	
          	prefs.mimeType = "mp4"
       	    dom.append("#video", {
			    nodeName: "source",
			    src: emby.getVideoStreamUrl({
				    itemId: item.Id,					
				    extension: item.MediaSources[0].Container
			    }),
			    "type": mime.lookup(prefs.mimeType)
		    });
	    }
        else
        {
        	prefs.mimeType = "m3u8"
        	dom.append("#video", {
			    nodeName: "source",
		        src: emby.getVideoHlsStreamUrl({
			        itemId: item.Id
		        }),
		        "type": mime.lookup(prefs.mimeType)
		    });
        }
		
   	   if (item.MediaSources[0].DefaultSubtitleStreamIndex == null)
   		   prefs.subtitleAvailable = false;
   	   else
   		   prefs.subtitleAvailable = true
   		   
		dom.append("#video", {
	        nodeName: "track",
		    "kind": "subtitles",
//		    "label": "English",
//		    "srclang": "en",
		    src: emby.getVideoSubtitleData({
			    itemId: item.Id,
			    mediaSourceId: item.MediaSources[0].Id,
			    mediaSourceIndex: item.MediaSources[0].DefaultSubtitleStreamIndex
		    })
        });
		var video = document.getElementById("video");		
		var playerRegion = document.getElementById("player");		
		var playButton = document.getElementById("play-pause");
		var stopButton = document.getElementById("stop-exit");
		var infoButton = document.getElementById("info-button");
		var seekBar = document.getElementById("seek-bar");

		video.textTracks[0].mode = 'showing'
		video.addEventListener("playing", function(event) {
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
			history.back();
		});
	
		video.addEventListener("timeupdate", function(event) {
			// update the time/duration and slider values
			if (video.currentTime == 0)
				return;
			prefs.videoDuration = video.duration;
			var durhr = Math.floor(prefs.videoDuration / 3600);
		    var durmin = Math.floor((prefs.videoDuration % 3600) / 60);
			durmin = durmin < 10 ? '0' + durmin : durmin;
				
			var curhr = Math.floor(video.currentTime / 3600);
		    var curmin = Math.floor((video.currentTime % 3600) / 60);
			curmin = curmin < 10 ? '0' + curmin : curmin;

			infoButton.innerHTML = curhr+":"+curmin+"/"+durhr+ ":"+durmin; 
			seekBar.value = (100 / prefs.videoDuration) * video.currentTime;

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
			history.back();
		});

		// Event listener for the seek bar
		seekBar.addEventListener("change", function() {
			// Calculate the new time
			var time = prefs.videoDuration * (seekBar.value / 100);

			// Update the video time
			prefs.currentTime = time
			var durhr = Math.floor(prefs.videoDuration / 3600);
		    var durmin = Math.floor((prefs.videoDuration % 3600) / 60);
			durmin = durmin < 10 ? '0' + durmin : durmin;
				
			var curhr = Math.floor(prefs.currentTime / 3600);
		    var curmin = Math.floor((prefs.currentTime % 3600) / 60);
			curmin = curmin < 10 ? '0' + curmin : curmin;
			infoButton.innerHTML = curhr+":"+curmin+"/"+durhr+ ":"+durmin; 
		});

	
		// Pause the video when the seek handle is being dragged
		seekBar.addEventListener("mousedown", function() {
			video.pause();
			self.showControls({persist: true})
			emby.postActiveEncodingStop()
			playButton.innerHTML = "Play";
		});

		// Play the video when the seek handle is dropped
		seekBar.addEventListener("mouseup", function() {
			self.showControls({duration: 1000})
			prefs.currentTime = prefs.videoDuration * (seekBar.value / 100);
			if (prefs.directPlay == true)
				video.currentTime = prefs.currentTime
			else
			{	
		        var options = {};
		        options.option = {};
		        options.option.transmission = {};
		        options.option.transmission.playTime = {};
		       	options.option.a3dMode = prefs.video3DFormat
		        options.option.transmission.playTime.start = prefs.currentTime*1000;

		        var str = escape(JSON.stringify(options))
		        str = str.replace("a3dMode","3dMode")
		        var node = dom.querySelector("source");
		        node.setAttribute('type',mime.lookup("m3u8")+';mediaOption=' +  str);
		        video.load();
			}
	        video.play();
			playButton.innerHTML = "Pause";
		});

		video.addEventListener("mousemove",function(){
			self.showControls({duration: 6000});
		});
		
        var options = {};
        options.option = {};
       	options.option.a3dMode = prefs.video3DFormat
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
           options.option.transmission = {};
           options.option.transmission.playTime = {};
           options.option.transmission.playTime.start = Math.floor(ts) * 1000;
		}
        var str = escape(JSON.stringify(options))
        str = str.replace("a3dMode","3dMode")
		var node = dom.querySelector("source");
        node.setAttribute('type',mime.lookup(prefs.mimeType)+';mediaOption=' +  str);
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
	dom.focus("#viewPlay")
   	
};

Player.prototype.skip = function() {
	var video = document.getElementById("video");
	if (prefs.firstSkip)
	{
		prefs.firstSkip = false
		prefs.currentTime = video.currentTime
		prefs.skipTime = Math.floor(prefs.fwdSkip)
		emby.postActiveEncodingStop()
	}
	else
		prefs.skipTime += Math.floor(prefs.fwdSkip)
		
	//conversion based on seconds
	var ts = 0;
	if (prefs.skipTime < 0)
		ts = prefs.skipTime * -1
	else
		ts = prefs.skipTime
	var mm = Math.floor( (ts % 3600) / 60);
	var ss = Math.floor(  (ts % 3600) % 60);

	//prepend '0' when needed
	mm = mm < 10 ? '0' + mm : mm;
	ss = ss < 10 ? '0' + ss : ss;

	//use it
	var str = mm + ":" + ss;
	prefs.skipTime < 0 ? str = "Back skipping " + str : str = "Skipping " + str
	playerpopup.show({
		duration: 2000,
		text: str
	});	

	if (prefs.playerRestarting)
		return
	if (prefs.interval)
  	    window.clearTimeout(prefs.interval);
	prefs.interval = window.setTimeout(this.restartAt, 700);
};

Player.prototype.backskip = function() {
	var video = document.getElementById("video");
	if (prefs.firstSkip)
	{
		prefs.firstSkip = false
		prefs.currentTime = video.currentTime
		prefs.skipTime = Math.floor(prefs.backSkip * -1)
		emby.postActiveEncodingStop()
	}
	else
		prefs.skipTime -= Math.floor(prefs.backSkip)
		
	//conversion based on seconds
	var ts = 0;
	if (prefs.skipTime < 0)
		ts = prefs.skipTime * -1
	else
		ts = prefs.skipTime
	var mm = Math.floor( (ts % 3600) / 60);
	var ss = Math.floor(  (ts % 3600) % 60);

	//prepend '0' when needed
	mm = mm < 10 ? '0' + mm : mm;
	ss = ss < 10 ? '0' + ss : ss;

	//use it
	var str = mm + ":" + ss;
	prefs.skipTime < 0 ? str = "Back skipping " + str : str = "Skipping " + str
	playerpopup.show({
		duration: 2000,
		text: str
	});	

	if (prefs.playerRestarting)
		return
	if (prefs.interval)
  	    window.clearTimeout(prefs.interval);
	prefs.interval = window.setTimeout(this.restartAt, 700);
};

Player.prototype.restartAt = function(){

	prefs.playerRestarting = true
	var restartPoint = Math.floor(prefs.currentTime + prefs.skipTime) * 1000
	if (restartPoint < 0)
	   restartPoint = 0;
	var video = document.getElementById("video");
    if (prefs.directPlay == true)
    {
    	video.currentTime = Math.floor(prefs.currentTime + prefs.skipTime)
    }	
    else
    {    	
	    var options = {};
        options.option = {};
        options.option.transmission = {};
        options.option.transmission.playTime = {};
       	options.option.a3dMode = prefs.video3DFormat
        options.option.transmission.playTime.start = restartPoint;

        var str = escape(JSON.stringify(options))
        str = str.replace("a3dMode","3dMode")
        var node = dom.querySelector("source");
        node.setAttribute('type',mime.lookup("m3u8")+';mediaOption=' +  str);
        video.load();
        video.play();
    }
    if (prefs.restartInterval)
    	window.clearTimeout(prefs.restartInterval)
    prefs.restartInterval = window.setTimeout(function(){
        prefs.firstSkip = true;
    }, 1500)
    prefs.playerRestarting = false
}

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
Player.prototype.showSubtitles = function(){
 	if (!prefs.subtitleAvailable)
 	{
		playerpopup.show({
			duration: 1000,
			text: "Subtitles not available"
		});	
	   return
 	}
 	var video = document.getElementById("video");
	video.textTracks[0].mode = 'showing'
	playerpopup.show({
		duration: 1000,
		text: "Subtitles Enabled"
	});	
}
Player.prototype.hideSubtitles = function(){
 	if (!prefs.subtitleAvailable)
 	{
		playerpopup.show({
			duration: 1000,
			text: "Subtitles not available"
		});	
 		return
 	}
 	var video = document.getElementById("video");
	video.textTracks[0].mode = 'hidden'
		playerpopup.show({
			duration: 1000,
			text: "Subtitles Disabled"
		});	
}