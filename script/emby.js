// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

var emby = new EMBY();

function EMBY() {
	this.limit = 20;
	this.settings = {};
	this.socket;
};

EMBY.prototype.getPublicUsers = function(settings) {
	settings = settings || {};
	self = this;
	
	ajax.request(settings.server + "/users/public" , {
		method: "GET",
		headers: this.headers(),	
		timeout: device.timeout,		 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});		
};

EMBY.prototype.authenticate = function(settings) {
	settings = settings || {};
	self = this;
	
	ajax.request(settings.server + "/Users/" + settings.credentials.userId + "/authenticate" , {
		method: "POST",
		headers: this.headers(),			
		data: {
			    Pw: settings.credentials.password,
				Password: CryptoJS.SHA1(settings.credentials.password).toString()
		}, 
		success: function(data) {
			data.ServerUrl = settings.server; 
			self.settings = data;
			settings.success(data);
		},
		error: settings.error
	});		
};

EMBY.prototype.authenticateByName = function(settings) {
	settings = settings || {};
	self = this;
	
	ajax.request(settings.server + "/users/authenticatebyname" , {
		method: "POST",
		headers: this.headers(),			
		data: {
				Username: settings.credentials.username,
				password: CryptoJS.SHA1(settings.credentials.password).toString()
		}, 
		success: function(data) {
			data.ServerUrl = settings.server; 
			self.settings = data;
			settings.success(data);
		},
		error: settings.error
	});		
};

EMBY.prototype.getSystemInformation = function(settings) {
	settings = settings || {};

	ajax.request(this.settings.ServerUrl + "/system/info" , {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

// Live Tv functions

EMBY.prototype.getLiveTV = function(settings){
	settings = settings || {};
	
	
	ajax.request(this.settings.ServerUrl + "/LiveTv/Info", {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getLiveTvSeriesTimers = function(settings){
	settings = settings || {};
	
	
	ajax.request(this.settings.ServerUrl + "/LiveTv/SeriesTimers", {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getLiveTvTimers = function(settings){
	settings = settings || {};
	
	
	ajax.request(this.settings.ServerUrl + "/LiveTv/Timers", {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.postLiveTvTimers = function(settings) {
	settings = settings || {};
	ajax.request(this.settings.ServerUrl + "/liveTv/Timers" , {
		method: "POST",
		headers: this.headers(), 
		data: settings.data,
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			

};

EMBY.prototype.postLiveTvSeriesTimers = function(settings) {
	settings = settings || {};
	ajax.request(this.settings.ServerUrl + "/liveTv/SeriesTimers" , {
		method: "POST",
		headers: this.headers(), 
		data: settings.data,
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			

};

EMBY.prototype.getLiveTvChannel = function(settings){
	settings = settings || {};
	var id = settings.id  || 0;
	
	
	ajax.request(this.settings.ServerUrl + "/LiveTV/Channels/"+id, {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getLiveTvChannels = function(settings){
	settings = settings || {};
	var id = settings.id  || 0;
	
	
	ajax.request(this.settings.ServerUrl + "/LiveTV/Channels/", {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getLiveTvProgram = function(settings) {
	settings = settings || {};
	var id = settings.id  || 0;
	
	ajax.request(this.settings.ServerUrl + "/LiveTv/Programs/" + id, {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getLiveTvPrograms = function(settings){
	settings = settings || {};
	var limit = settings.limit || "";
	var MaxStartDate = settings.MaxStartDate || "";
	var MinStartDate = settings.MinStartDate || "";
	var isMovie = settings.isMovie || "";
	var isSeries = settings.isSeries || "";
	var StartIndex = settings.StartIndex || "";
	var HasAired = settings.HasAired || "";
	
	//was: SortBy=sortName&SortOrder=Ascending&
	ajax.request(this.settings.ServerUrl + '/LiveTV/Programs?SortBy=sortName&Fields=SortName&SortOrder=Ascending&enableImageTypes=primary,thumb,backdrop'+
		(limit ? "&limit=" + limit : "")+
		(HasAired ? "&HasAired=" + HasAired : "")+
		(MinStartDate ? "&MinStartDate=" + MinStartDate : "")+
		(isMovie ? "&isMovie=" + isMovie : "")+
		(isSeries ? "&isSeries=" + isSeries : "")+
		(StartIndex ? "&StartIndex=" + StartIndex : "")+
		(MaxStartDate ? "&MaxStartDate=" + MaxStartDate : "") , {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.deleteLiveTvTimer = function(settings) {
	settings = settings || {};
	
	ajax.request(this.settings.ServerUrl + "/LiveTv/Timers/" + settings.id, {
		method: "DELETE",
		headers: this.headers(),
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.deleteLiveTvSeriesTimer = function(settings) {
	settings = settings || {};
	
	ajax.request(this.settings.ServerUrl + "/LiveTv/SeriesTimers/" + settings.id, {
		method: "DELETE",
		headers: this.headers(),
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getLiveTvHlsStreamUrl = function(settings) {
	settings = settings || {};
		
	var itemId = settings.itemid;
	var container = settings.container  || "ts";
	return this.settings.ServerUrl + "/videos/" + itemId + "/live.m3u8" +
	"?id=" + itemId + 
	"&SegmentContainer=" + container + 
	"&MediaSourceId="+ settings.mediaSourceId + 
	"&LiveStreamId="+ settings.liveStreamId + 
	"&PlaySessionId=" + settings.playSessionId + 
	"&AudioCodec=mp3,aac" +
	"&MinSegments=1" +
	"&AudioStreamIndex=-1" +
	"&TranscodingMaxAudioChannels=2" +
	"&BreakOnNonKeyFrames=True" +
	"&ManifestSubtitles=vtt" +
	"&TranscodeReasons=ContainerNotSupported" +
    "&VideoCodec=h264"+
    "&h264-profile=high,main,baseline,constrainedbaseline,high10" +
    "&h264-level=51" + 
	"&VideoBitrate=139808000"
	"&AudioBitrate=192000"
	;
	
};

// User Functions

EMBY.prototype.getUser = function(settings) {
	settings = settings || {};
	var userId = settings.userId || this.settings.User.Id;
	
	ajax.request(this.settings.ServerUrl + "/users/" + userId, {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getUserViews = function(settings) {
	settings = settings || {};
	
	ajax.request(this.settings.ServerUrl + "/users/" + this.settings.User.Id + "/views", {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getUserLastestItems = function(settings) {
	settings = settings || {};
	
	var d = {};
	var includeItemTypes = settings.includeItemTypes || "";
	var parentId = settings.parentId;
	var parentName = settings.parentName || "";		
	var parent = settings.parent || {};
	var label = settings.label || "";		
	var fields = settings.fields || "sortname";
	var limit = settings.limit || this.limit;
	var imageTypeLimit = settings.imageTypeLimit || 1;
	var enableImageTypes = settings.enableImageTypes || "";
	
	ajax.request(this.settings.ServerUrl + "/users/" + this.settings.User.Id  + "/items/latest?" + 
		(includeItemTypes ? "includeItemTypes=" + includeItemTypes : "") + 
		(limit ? "&limit=" + limit : "") + 
		(fields ? "&fields=" + fields : "") + 
		(parentId ? "&parentId=" + parentId : "") + 
		(imageTypeLimit ? "&imageTypeLimit=" + imageTypeLimit : "") + 
		(enableImageTypes ? "&enableImageTypes=" + enableImageTypes : "") + 
		"&AddPlayedIndicator=true", {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			d.Items = data;
			d.parentId = parentId;
			d.parentName = parentName;			
			d.parent = parent;
			d.limit = limit;
			d.label = label;				
			settings.success(d);
		},
		error: settings.error
	});			
};

EMBY.prototype.getUserItems = function(settings) {
	settings = settings || {};
	
	var includeItemTypes = settings.includeItemTypes || "";
	var mediaTypes = settings.mediaTypes || "";	
	var parentId = settings.parentId || "";
	var parentName = settings.parentName || "";	
	var parent = settings.parent || {};	
	var label = settings.label || "";		
	var fields = settings.fields || "sortname";
	var startIndex = settings.startIndex || 0;
	var limit = settings.limit || this.limit;
	var imageTypeLimit = settings.imageTypeLimit || 1;
	var enableImageTypes = settings.enableImageTypes || "";
	var recursive = settings.recursive || true;
	var sortBy = settings.sortBy || "sortname";
	var sortOrder = settings.sortOrder || "ascending";
	var filters = settings.filters || "";
	var locationTypes = settings.locationTypes || "filesystem";
	var nameStartsWithOrGreater = settings.nameStartsWithOrGreater || "";
	var forceThumb = settings.forceThumb || false;
	var	genres = settings.genres || "";
	var artistIds = settings.artistIds || "";
				
	ajax.request(this.settings.ServerUrl + "/users/" + this.settings.User.Id  + "/items?" + 
		(sortBy ? "sortBy=" + sortBy : "") + 
		(sortOrder ? "&sortOrder=" + sortOrder : "") +
		(filters ? "&filters=" + filters : "") + 
		(recursive ? "&recursive=" + recursive : "") + 
		(mediaTypes ? "&mediaTypes=" + mediaTypes : "") + 
		(includeItemTypes ? "&includeItemTypes=" + includeItemTypes : "") + 
		(startIndex ? "&startIndex=" + startIndex : "") + 
		(limit ? "&limit=" + limit : "") + 
		(fields ? "&fields=" + fields : "") + 
		(parentId ? "&parentId=" + parentId : "") + 
		(imageTypeLimit ? "&imageTypeLimit=" + imageTypeLimit : "") + 
		(enableImageTypes ? "&enableImageTypes=" + enableImageTypes : "") + 
		(locationTypes ? "&locationTypes=" + locationTypes : "") + 
		(genres ? "&genres=" + genres : "") + 
		(artistIds ? "&artistIds=" + artistIds : "") + 
		(nameStartsWithOrGreater ? "&nameStartsWithOrGreater=" + nameStartsWithOrGreater : "") , {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			data.parentId = parentId;
			data.parentName = parentName;
			data.parent = parent;
			data.limit = limit;	
			data.label = label;
			data.startIndex = startIndex;
			data.forceThumb = forceThumb;		
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.deleteItem = function(settings) {
	settings = settings || {};
	
	ajax.request(this.settings.ServerUrl + "/items/" + settings.id, {
		method: "DELETE",
		headers: this.headers()
	});			
};

EMBY.prototype.getPlaybackInfo = function(settings) {
	settings = settings || {};
	
	ajax.request(this.settings.ServerUrl + "/Items/" + settings.id+ '/PlaybackInfo?UserId='+ this.settings.User.Id  + "&StartTimeTicks=0&IsPlayback=true&AutoOpenLiveStream=true&MaxStreamingBitrate=10894941", {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getUserItem = function(settings) {
	settings = settings || {};
	
	ajax.request(this.settings.ServerUrl + "/users/" + this.settings.User.Id  + "/items/" + settings.id, {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getShowsSeasons = function(settings) {
	settings = settings || {};
	
	var fields = settings.fields || "sortname";
				
	ajax.request(this.settings.ServerUrl + "/shows/" + settings.id  + "/seasons?" + 
		"&userId=" + this.settings.User.Id +
		(fields ? "&fields=" + fields : ""), {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {		
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getShowsEpisodes = function(settings) {
	settings = settings || {};
	
	var fields = settings.fields || "sortname";
				
	ajax.request(this.settings.ServerUrl + "/shows/" + settings.id  + "/episodes?" + 
		"seasonId=" + settings.seasonId +
		"&EnableUserData=true" +
		"&userId=" + this.settings.User.Id +
		(fields ? "&fields=" + fields : ""), {
		method: "GET",
		headers: this.headers(), 
		success: function(data) {		
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.getVideoSubtitleData = function(settings) {
	settings = settings || {};
	
	var itemId = settings.itemId;
	var mediaSourceId = settings.mediaSourceId;
    var index = settings.mediaSourceIndex
    return this.settings.ServerUrl + "/Videos/" + itemId + "/" + mediaSourceId + "/Subtitles/" + index + "/Stream.vtt"
	
};

EMBY.prototype.getVideoStreamUrl = function(settings) {
	settings = settings || {};
		
	var itemId = settings.itemId;
	var deviceId = settings.deviceId || this.settings.SessionInfo.DeviceId;
	var mediaSourceId = settings.mediaSourceId;
	var t = ""
	var startTimeTicks = prefs.resumeTicks / 10000000;
	if (startTimeTicks)
		t= "#t=" + startTimeTicks 
	var videoCodec = settings.videoCodec || "h264";
	var audioCodec = settings.audioCodec || "aac";
	var videoBitrate = Math.floor(prefs.videoBitrate) || 10000000;
	var audioBitrate = Math.floor(prefs.audioBitrate) || 128000;
	var maxAudioChannels = settings.maxAudioChannels || 5;
	var direct = settings.direct || "true";
	var playSessionId = settings.playSessionId || "1c7fddb7712646f9ba6352f8d9afc79e"; // not using mediasource api so using random string per api doc;

	return this.settings.ServerUrl + "/Videos/" + itemId + "/stream" + "?static=" + direct + "&videoBitrate=" + videoBitrate + "&mediaSourceId=" + mediaSourceId +"&playSessionId =" + playSessionId +
	"&audioBitrate=" + audioBitrate + "&maxAudioChannels=" + maxAudioChannels + "&api_key=" + this.settings.AccessToken + t;

// server v3.5 setting
//	return this.settings.ServerUrl + "/Videos/" + itemId + "/stream" + "?static=" + direct + "&mediaSourceId=" + itemId + "&videoBitrate=" + videoBitrate +
//	"&audioBitrate=" + audioBitrate + "&maxAudioChannels=" + maxAudioChannels + "&api_key=" + this.settings.AccessToken + t;

};

EMBY.prototype.getVideoHlsStreamUrl = function(settings) {
	settings = settings || {};
		
	var itemId = settings.itemId;
	var mediaSourceId = settings.mediaSourceId;
	var deviceId = settings.deviceId || this.settings.SessionInfo.DeviceId;
	var videoCodec = settings.videoCodec || "h264";
	var audioCodec = settings.audioCodec || "aac";

	var direct = false;
	var audioStreamIndex = settings.audioStreamIndex || 1;
	var videoBitrate = Math.floor(prefs.videoBitrate) ;
	if (videoBitrate == 0)
		direct = true;
	var audioBitrate = Math.floor(prefs.audioBitrate) || 128000;
	var maxAudioChannels = settings.maxAudioChannels || 5;
	var maxHeight = settings.maxHeight || 720;
	var level = settings.level || 41;
	var clientTime = settings.clientTime || "";
	var profile = settings.profile || "high";
	var playSessionId = settings.playSessionId || "1c7fddb7712646f9ba6352f8d9afc79e";
/*
//  server v3.5 settings 
	return this.settings.ServerUrl + "/videos/" + itemId + "/master.m3u8?static =" + direct + "&deviceId=" + deviceId + "&mediaSourceId=" + itemId +
	"&videoCodec=" + videoCodec + "&audioCodec=" + audioCodec + "&audioStreamIndex=" + audioStreamIndex + "&videoBitrate=" + videoBitrate + 
	"&audioBitrate=" + audioBitrate + "&maxAudioChannels=" + maxAudioChannels + "&maxHeight=" + maxHeight + "&level=" + level +
	"&clientTime=" + clientTime + "&profile=" + profile + "&api_key=" + this.settings.AccessToken;
*/
//  server 3.6 settings	
	return this.settings.ServerUrl + "/videos/" + itemId + "/master.m3u8?static =" + direct + "&deviceId=" + deviceId + "&mediaSourceId=" + mediaSourceId +"&playSessionId =" + playSessionId + 
	"&videoCodec=" + videoCodec + "&audioCodec=" + audioCodec + "&audioStreamIndex=" + audioStreamIndex + "&videoBitrate=" + videoBitrate + 
	"&audioBitrate=" + audioBitrate + "&maxAudioChannels=" + maxAudioChannels + "&maxHeight=" + maxHeight + "&level=" + level +
	"&clientTime=" + clientTime + "&profile=" + profile + "&api_key=" + this.settings.AccessToken;
	
};


EMBY.prototype.getImageUrl = function(settings) {
	settings = settings || {};
	
	var item = settings.itemId;
	var tag = settings.tag;
	var imageType = settings.imageType || "Primary";
	var height = settings.height || "";
	var width = settings.width || "";	
	var enableImageEnhancers = settings.enableImageEnhancers || true;	
	var quality = settings.quality || 90;	
	var percentPlayed = settings.percentPlayed || "";
	var addPlayedIndicator = settings.addPlayedIndicator || false;
	return this.settings.ServerUrl + "/items/" + item + "/images/" + imageType + "?height=" + height + "&width=" + width + "&tag=" + tag + "&enableImageEnhancers=" + enableImageEnhancers + "&quality=" + quality + "&percentPlayed=" + percentPlayed + "&addPlayedIndicator=" + addPlayedIndicator;
//	return this.settings.ServerUrl + "/items/" + item + "/images/" + imageType + "?tag=" + tag + "&enableImageEnhancers=" + enableImageEnhancers + "&quality=" + quality + "&percentPlayed=" + percentPlayed + "&addPlayedIndicator=" + addPlayedIndicator;
};
	
EMBY.prototype.getUserImageUrl = function(settings) {
	settings = settings || {};
	
	var userId = settings.userId;
	var tag = settings.tag;
	var imageType = settings.imageType || "Primary";
	var height = settings.height || "";
	var width = settings.width || "";	
	var enableImageEnhancers = settings.enableImageEnhancers || true;	
	var quality = settings.quality || 90;	
	
	return this.settings.ServerUrl + "/users/" + userId + "/images/" + imageType + "?height=" + height + "&width=" + width + "&tag=" + tag + "&enableImageEnhancers=" + enableImageEnhancers + "&quality=" + quality;
};	
	
	
EMBY.prototype.headers = function() {	
	var headers = {};
	
	headers['Content-Type'] = 'application/json';
	headers['Accept'] = 'application/json, text/javascript, */*; q=0.01';
	headers['Authorization'] = 'Emby Client="' + device.client + '", Device="' + device.name + 
		'", DeviceId="' + device.id + '", Version="' + device.version + '"';
	
	if (this.settings.User) {
		headers['Authorization'] += ', UserId="' + this.settings.User.Id + '"';
	}
	
	if (this.settings.AccessToken) {
		headers['X-Mediabrowser-Token'] = this.settings.AccessToken; //legacy: change to X-Emby-Token to remove v3.x server support
	}
	
	return headers;			
};


EMBY.prototype.postSessionPlayingStarted = function(settings) {
	settings = settings || {};

	ajax.request(this.settings.ServerUrl + "/sessions/playing" , {
		method: "POST",
		headers: this.headers(), 
		data: settings.data,
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.postSessionPlayingProgress = function(settings) {
	settings = settings || {};

	ajax.request(this.settings.ServerUrl + "/sessions/playing/progress" , {
		method: "POST",
		headers: this.headers(), 
		data: settings.data,
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.postSessionPlayingStopped = function(settings) {
	settings = settings || {};

	ajax.request(this.settings.ServerUrl + "/sessions/playing/stopped" , {
		method: "POST",
		headers: this.headers(), 
		data: settings.data,
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			

};

EMBY.prototype.postLiveStreamClose = function(settings) {
	settings = settings || {};
	ajax.request(this.settings.ServerUrl + "/liveStreams/Close" , {
		method: "POST",
		headers: this.headers(), 
		data: settings.data,
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			

};

EMBY.prototype.postPlaybackInfo = function(settings) {
	settings = settings || {};

	ajax.request(this.settings.ServerUrl + "/Items/"+settings.id+"/PlaybackInfo?UserId="+settings.userid+"&StartTimeTicks=0&IsPlayback=true&AutoOpenLiveStream=true&MaxStreamingBitrate=140000000&EnableDirectStream=true" , {
		method: "POST",
		headers: this.headers(), 
		data: settings.data,
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			

};

EMBY.prototype.postActiveEncodingStop = function(settings) {
	ajax.request(this.settings.ServerUrl + "/Videos/ActiveEncodings?DeviceId=" + device.id , {
		method: "DELETE",
		headers: this.headers(), 
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};	

EMBY.prototype.updatePlayedStatus = function(settings) {
	settings = settings || {};
	if (settings.UserData.Played == true)
		posttype = "POST";
	else		
		posttype = "DELETE";

	data = storage.get("emby.settings.current.user");
	ajax.request(this.settings.ServerUrl + "/users/" + data.userId + "/playeditems/" + settings.Id , {
		method: posttype,
		headers: this.headers(), 
		data: settings,
		success: function(data) {
			settings.success(data);
		},
		error: settings.error
	});			
};

EMBY.prototype.socketOpen = function(settings) {

	var server = "ws" + this.settings.ServerUrl.substr(4); 	
	var apiKey = this.settings.AccessToken;
	this.socket = new WebSocket(server + "?api_key=" + apiKey + "&deviceId=" + device.id);	
};

EMBY.prototype.socketClose = function() {
	this.socket.close();
	this.socket = null;
};

EMBY.prototype.socketSend = function(data) {
	this.socket.send(data);	
};