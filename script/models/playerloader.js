// Author: Kevin Wilcox
// Modifed: 04/02/2018
// The Paradigm Grid
// --------------------------------------------

function PlayerLoader() {
	var channelid;
	var data;
	var launched;
};
PlayerLoader.prototype.load = function(data) {
	var self = this
	prefs.liveStreamId = null;
	self.channelid = data.ChannelId;
	if (typeof self.channelid != 'undefined')
		prefs.isLiveTvItem = true;
	else
		prefs.isLiveTvItem = false;
	if (prefs.isLiveTvItem)
		emby.getLiveTvChannel({
			id: data.ChannelId,
			success: postPlaybackInfo,
			error: tunerError
		});
	else
		emby.getUserItem({
			id: data.Id,
			success: launchPlayer,
			error: error					
		});	

	function getPlaybackInfo(data){
    	self.data = data;
    	emby.getPlaybackInfo({
    		id: data.Id,
    		success: postPlaybackInfo,
    		error: tunerError
    	})
    }
	
	function postPlaybackInfo(data){
		self.data = data;
    	emby.postPlaybackInfo({
    		id: self.channelid,
    		userid: emby.settings.User.Id,
    		success: prepPlayerLaunch,
    		error: tunerError
    	})
    }
    function prepPlayerLaunch(data){
       prefs.mediaSourceId = data.MediaSources[0].Id
	   prefs.liveStreamId = data.MediaSources[0].LiveStreamId;
	   prefs.playSessionId = data.PlaySessionId;
   	   launchPlayer(self.data);
    }
    function launchPlayer(data){
		prefs.resumeTicks = 0;
	    dom.dispatchCustonEvent(document, "launchPlayer", data);
	}
	function error(){
		playerpopup.show({
		      duration: 2000,
		      text: 'Player not Loaded'
	       })		
	}
	function tunerError(){
		dom.hide('#playerBackdrop')
		playerpopup.show({
		      duration: 2000,
		      text: 'Channel not available'
	       })		
		
	}
}