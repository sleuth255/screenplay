// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

function Item() {
	this.data = {};
	this.tvdata = {};
	this.timerdata = {};
	this.iteration;
	this.playedStatus;
	this.recordStatus;
	this.lostfocus;
};

Item.prototype.close = function(){
	dom.off("body","keydown", this.lostfocus);
	dom.remove("#item")
}
Item.prototype.load = function(id, backstate, settings) {
	settings = settings || {};
	var self = this;
    var timerDTO ={
    	RecordAnyTime:true,
    	SkipEpisodesInLibrary:false,
    	RecordAnyChannel:false,
    	KeepUpTo:0,
    	RecordNewOnly:false,
    	Days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    	DayPattern:"Daily",
    	ImageTags:{},
    	Type:"SeriesTimer",
    	ServerId:"",
    	ChannelId:"",
    	ChannelName:"",
    	ProgramId:"",
    	ExternalProgramId:"",
    	Name:"",
    	Overview:"",
    	StartDate:"",
    	EndDate:"",
    	ServiceName:"Emby",
    	Priority:0,
    	PrePaddingSeconds:0,
    	PostPaddingSeconds:0,
    	IsPrePaddingRequired:false,
    	IsPostPaddingRequired:false,
    	KeepUntil:"UntilDeleted"
    }
	
	
	
	
	
	
	dom.remove('#playerBackdrop');
	dom.remove('#spinnerBackdrop')
	dom.hide("#server");
	dom.hide("#user");
	dom.hide("#details")
	dom.show("#homeLink");
	

	if (dom.exists("#item"))
		dom.remove("#item")

	dom.append("body", {
		nodeName: "div",
		className: "backdrop",
		id: "playerBackdrop"
	});
	dom.append("body", {
		nodeName: "div",
		className: "backdrop",
		id: "spinnerBackdrop",
		childNodes: [{
			nodeName: "img",
			className: "spinningimage",
			src: "images/spinner.png",
			width: 200,
			height: 200
		}]
	});
	dom.hide('#playerBackdrop')
	dom.hide('#spinnerBackdrop')
	emby.getLiveTvProgram({
		id: id,
		success: storeTvItem,
		error: getUserItem					
	})	

	function storeTvItem(data){
		self.tvdata = data;
		emby.getUserItem({
			id: id,
			success: displayItem,
			error: error					
		})	
	}
	function getUserItem(){
		self.tvdata = {};
		emby.getUserItem({
			id: id,
			success: displayItem,
			error: error					
		})	
		
	}
	function displayItem(data) {
		self.data = data;
		now = new Date().toISOString();

		
		if (data.Type == "Series" || data.Type == "Season")
		{
			dom.html("#view", {
				nodeName: "div",
				className: "item-view",
				id: "item",
				childNodes: [{
					nodeName: "div",
					className: "item-content",
					id: "itemContent"
				}]
			});
		}
		else
		{
		   var idx = 0
		   dom.html("#view", {
			   nodeName: "div",
			   className: "item-view",
			   id: "item",
			   childNodes: [{
				   nodeName: "div",
				   className: "user-views",
				   id: "userViews",
				   childNodes: [{
					   nodeName: "div",
					   className: "user-views-column",
					   id: "userViews_0"
				   }]
			   }, {
				   nodeName: "div",
				   className: "item-content",
				   id: "itemContent"
			   }]
		   });
		   if (typeof data.ChannelId != 'undefined' && data.StartDate > now) // liveTv item
		   {
		      dom.append("#userViews_0", {
			      nodeName: "a",
			      href: "#",
			      className: "user-views-item user-views-item_0",
			      id: "viewRecord",
			      dataset: {
					   keyUp: "#homeLink a",
					   keyDown: ".user-views-item_"+ (idx+1),
					   keyRight: "a.latest-item"	
			      },
			      childNodes: [{
				      nodeName: "span",
				      className: "user-views-item-name glyphicon record",	
				      text: ""				
			      }]
		      });
		   }
		   else
		   {
		      dom.append("#userViews_0", {
			      nodeName: "a",
			      href: "#",
			      className: "user-views-item user-views-item_0",
			      id: "viewPlay",
			      dataset: {
					   keyUp: "#homeLink a",
					   keyDown: ".user-views-item_"+ (idx+1),
					   keyRight: "a.latest-item"	
			      },
			      childNodes: [{
				      nodeName: "span",
				      className: "user-views-item-name glyphicon play",	
				      text: ""				
			      }]
		      });
		   }
		   
		   if (data.UserData.PlaybackPositionTicks > 0)  // resume data available: show resume button
		   {
   		      dom.append("#userViews_0", {
			      nodeName: "a",
			      href: "#",
			      className: "user-views-item user-views-item_" + ++idx,
			      id: "viewResume",
			      dataset: {
				      keyUp: ".user-views-item_"+ (idx-1),
				      keyDown: ".user-views-item_"+ (idx+1),
				      keyRight: "a.latest-item"	
			      },
			      childNodes: [{
				      nodeName: "span",
				      className: "user-views-item-name glyphicon forward",	
				      text: ""				
			      }]
		      });		
		   }
		   
		   if (typeof data.ChannelId == 'undefined') // not a liveTv item
		   {
		      dom.append("#userViews_0", {
			      nodeName: "a",
			      href: "#",
			      className: "user-views-item user-views-item_" + ++idx,
			      id: "viewTogglePlayed",
			      dataset: {
				      keyUp: ".user-views-item_"+ (idx-1),
				      keyDown: ".user-views-item_"+ (idx+1),
				      keyRight: "a.latest-item"	
			      },
			      childNodes: [{
				      nodeName: "span",
				      className: "user-views-item-name glyphicon played",	
			          text: ""				
			      }]
		      });		
		      if (data.CanDelete == true)
		      {	   
		         dom.append("#userViews_0", {
			         nodeName: "a",
			         href: "#",
			         className: "user-views-item user-views-item_" + ++idx,
			         id: "viewDelete",
			         dataset: {
				         keyUp: ".user-views-item_"+ (idx-1),
				         keyDown: ".user-views-item_"+ (idx+1),
				        keyRight: "a.latest-item"	
			         },
			         childNodes: [{
				         nodeName: "span",
 				         className: "user-views-item-name glyphicon trash",	
				         text: ""				
			         }]
		         });
		      }
		   }
		}
		

		
 	    if (typeof data.ChannelId != 'undefined') // liveTv item
 	   	   dom.css("#poster", {
 			   backgroundImage: "url(./images/generic-backdrop.png)"
 		   });
 	    else
		if (data.BackdropImageTags && data.BackdropImageTags[0])
			dom.css("#poster", {
				backgroundImage: "url(" + emby.getImageUrl({'itemId': data.Id, tag: data.BackdropImageTags[0], imageType: 'Backdrop', height: 1080}) + ")"
			});	
		else 
		if (data.ParentBackdropImageTags && data.ParentBackdropImageTags[0]) 
			dom.css("#poster", {
				backgroundImage: "url(" + emby.getImageUrl({'itemId': data.ParentBackdropItemId, tag: data.ParentBackdropImageTags[0], imageType: 'Backdrop', height: 1080}) + ")"
			});				
		
		dom.addClass("#item", "item-view-" + data.Type.toLowerCase());
		
		renderer.userItem(data,self.tvdata, {
			container: "#itemContent"
		});
		
		switch(data.Type) {
			case "Series":
				emby.getShowsSeasons({
					id: data.Id,
					fields: "ItemCounts,AudioInfo",	
					success: function(data) {
						data.heading = "Seasons";						
						displayUserItemChildren(data)
					},
					error: error				
				});	
				break;

			case "Season":
				emby.getShowsEpisodes({
					id: data.SeriesId,
					seasonId: data.Id,
					fields: "ItemCounts,AudioInfo",	
					success: function(data) {
						data.heading = "Episodes";						
						displayUserItemChildren(data)
					},
					error: error				
				});	
				break;
								
		}	
		
		if (data.Type != "Series" && data.Type != "Season")
		{
            focus("#userViews a:first-child");
			if (data.Video3DFormat == "HalfTopAndBottom")
			   prefs.video3DFormat = "top_bottom"
			else				   
			if (data.Video3DFormat == "HalfSideBySide")
			   prefs.video3DFormat = "side_by_side_LR"
			else				   
			if (data.Video3DFormat == "FullSideBySide")
				prefs.video3DFormat = "side_by_side_full_LR"
			else
				prefs.video3DFormat = "2D"
		}

		this.lostfocus = dom.on("body", "keydown", lostFocus);

		dom.on("#viewPlay", "click", function(event) {
			event.preventDefault();
			prefs.resumeTicks = 0;
			flashButton(event.target);
		    dom.dispatchCustonEvent(document, "playItem", self.data);
		});
		dom.on("#viewResume", "click", function(event) {
			event.preventDefault();
			prefs.resumeTicks = data.UserData.PlaybackPositionTicks;
			flashButton(event.target);
			dom.dispatchCustonEvent(document, "playItem", self.data);
		});
		dom.on("#viewRecord", "click", function(event) {
			event.preventDefault();
			flashButton(event.target);
            handleRecordRequest()
        });
		dom.on("#viewTogglePlayed", "click", function(event) {
			event.preventDefault()
			if (data.UserData.Played == false)
				data.UserData.Played = true
			else
				data.UserData.Played = false
			prefs.playedStatus = data.UserData.Played
			flashButton(event.target);
			emby.updatePlayedStatus({
				Id: id,
				UserData: data.UserData,
				success: success,
				error: error
			})
			emby.getUserItem({
				id: id,
				success: loadData,
				error: error					
			})	
	    });
		dom.on("#viewDelete", "click", function(event) {
			event.preventDefault()
			flashButton(event.target);
			validaterequest.showPopup({
				eventHandler: "#viewDelete",
				text: "Delete Item?"
			});	
			
		});
		dom.on("#viewDelete","validate-yes", function(event){
			emby.deleteItem({
				id: data.Id				
			})	
			dom.dispatchCustonEvent(document, "itemDeleted", self.data);
		})
		dom.on("#viewDelete","validate-no", function(event){
			focus("#viewDelete");
		})

		dom.delegate("#item", "a", "keydown", navigation);
	}

	
	function lostFocus(event) {
		if (dom.exists("#screenplaySettings") || dom.exists("#player") || dom.exists("#validaterequest"))
			return;
		if (event.target.tagName != "A") 
    	   if (dom.exists(".user-views-item"))
               focus(".user-views-item");
    	   else
    		   focus(".homelink")
	}   

	function flashButton(node){
		if (dom.hasClass(node,'user-views-item')){
		    dom.removeClass(node,"user-views-item")
		    dom.addClass(node,"user-views-item-click")
		    window.setTimeout(function(){
			    dom.removeClass(node,"user-views-item-click")
			    dom.addClass(node,"user-views-item")
		    },100)
		}
		else{
		    dom.removeClass(node.parentNode,"user-views-item")
		    dom.addClass(node.parentNode,"user-views-item-click")
		    window.setTimeout(function(){
			    dom.removeClass(node.parentNode,"user-views-item-click")
			    dom.addClass(node.parentNode,"user-views-item")
		    },100)
			
		}
	}
	function handleRecordRequest(){
    	emby.getLiveTvProgram({
    		id: self.data.Id,
    		success: processRecordState,
    		error: recorderror
    	})
    }
    function processRecordState(data){
    	if (data.SeriesTimerId)
    		cancelSeriesRecordTimer(data.SeriesTimerId)
    	else
//    	if (data.TimerId && data.IsSeries)
//    		scheduleSeriesRecordTimer()
//        else    		
    	if (!data.TimerId)
    	   scheduleItemRecordTimer();
    	else
    	   cancelItemRecordTimer(data.TimerId);
    }
    function cancelSeriesRecordTimer(TimerId){
        self.recordStatus = false;
  	   emby.deleteLiveTvSeriesTimer({
 		   id: TimerId,
 		   success: handleResult,
 		   error: recorderror
 	   })
     }
 	function scheduleSeriesRecordTimer(){
 		self.recordStatus = true;
 		timerDTO.ServerId = self.data.ServerId;
 		timerDTO.ChannelId = self.data.ChannelId;
 		timerDTO.ProgramId = self.data.Id;
 		timerDTO.StartDate = self.data.StartDate;
 		timerDTO.EndDate = self.data.EndDate
 	    emby.postLiveTvSeriesTimers({
 		    data: timerDTO,
 		    success: handleResult,
 		    error: recorderror
 	     })
 		
 	}
    function cancelItemRecordTimer(TimerId){
       self.recordStatus = false;
 	   emby.deleteLiveTvTimer({
		   id: TimerId,
		   success: handleResult,
		   error: recorderror
	   })
    }
	function scheduleItemRecordTimer(){
		self.recordStatus = true;
		timerDTO.ServerId = self.data.ServerId;
		timerDTO.ChannelId = self.data.ChannelId;
		timerDTO.ProgramId = self.data.Id;
		timerDTO.StartDate = self.data.StartDate;
		timerDTO.EndDate = self.data.EndDate
	    emby.postLiveTvTimers({
		    data: timerDTO,
		    success: handleResult,
		    error: recorderror
	     })
		
	}
	function handleResult(data){
    	emby.getLiveTvProgram({
    		id: self.data.Id,
    		success: updateItemPage,
    		error: recorderror
    	})
	}
	function updateItemPage(data){
		if (data.TimerId && self.recordStatus || !data.TimerId && !self.recordStatus)
		{
			dom.dispatchCustonEvent(document, "reloadItem", data)
	        return
		}
    	emby.getLiveTvProgram({
    		id: self.data.Id,
    		success: updateItemPage,
    		error: recorderror
    	})
	}
	function loadData(data){
		if (data.UserData.Played == prefs.playedStatus)
		{
			dom.dispatchCustonEvent(document, "reloadItem", data)
	        return
		}    
		emby.getUserItem({
			id: id,
			success: loadData,
			error: error					
		})	
	}
	function displayUserItemChildren(data) {
		renderer.userItemChildren(data, {
			id: "ci_" + guid.create(),
			heading: data.heading,
			headerLink: "#homeLink a",
			container: "#item"
		});
		
		dom.delegate("#item", "a.latest-item", "click", function(event) {
			event.stopPropagation()
			event.preventDefault()
			prefs.lastEpisodeFocus = event.delegateTarget.dataset.index;
			dom.dispatchCustonEvent(document, "mediaItemSelected", event.delegateTarget.dataset);
		});	
		if (backstate == false || prefs.lastEpisodeFocus == null)
            focus(".latest-item");
		else
			episodefocus();
//		dom.delegate("#item", "a.latest-item", "keydown", navigation);
	}

	function navigation(event) {
		event.preventDefault();
		if (dom.exists("#player"))
			return;
		var self = event.delegateTarget;

		if (event.which == keys.KEY_OK) {
			event.stopPropagation()
			self.click();
			return;
		}
		
		if (dom.hasClass(self, "user-views-item")) {	
			switch (event.which) {
				case keys.KEY_LEFT: 
					focus(dom.data(self, "keyLeft"));
					break;
				case keys.KEY_UP: 
					focus(dom.data(self, "keyUp"));
					break;
				case keys.KEY_RIGHT: 
					focus(dom.data(self, "keyRight"));
					break;
				case keys.KEY_DOWN: 
					focus(dom.data(self, "keyDown"));
					break;											
			}
		}	
		
		if (dom.hasClass(self, "latest-item")) {	
			var columnSetIndex = this.parentNode.parentNode.id ? parseInt(self.parentNode.parentNode.id.substr(self.parentNode.parentNode.id.lastIndexOf("_") + 1)) : 0;
			var lastColumn = columnSetIndex > 0 ? dom.data("#latestItemSet_" + (columnSetIndex - 1), "lastColumn") : "";

			switch (event.which) {
				case keys.KEY_LEFT: 
					focus(dom.data(self, "keyLeft").replace("%previous%", columnSetIndex > 0 ? "#latestItemSet_" + (columnSetIndex - 1) +  " .latest-items-column-" + lastColumn + " a" : ".user-views .user-views-column:last-child a"));
					break;
				case keys.KEY_UP: 
					focus(dom.data(self, "keyUp"));
					break;
				case keys.KEY_RIGHT: 
					focus(dom.data(self, "keyRight").replace("%next%", "#latestItemSet_" + (columnSetIndex + 1) +  " .latest-items-column a"));
					break;
				case keys.KEY_DOWN: 
					var down = dom.data(self, "keyDown");
					focus(down == "%index%" ? dom.data("#collectionIndex", "lastFocus") : down);
					break;																	
			}
		}				
	}

	function episodefocus(){
		var elmnts = document.getElementsByClassName("latest-item")
		var focusid = "#"+elmnts[prefs.lastEpisodeFocus].id
		prefs.lastEpisodeFocus = null;
        focus(focusid);
	}
	function focus(query) {
		var node = dom.focus(query);
		if (node && node.id) {
			if (node.classList.contains("latest-item") || node.classList.contains("user-views-item")) {
				dom.data("#view", "lastFocus", "#" + node.id);
			}
		}
	}
		
	function success(data){
		return;
	}
	function error(data) {
		message.show({
			messageType: message.error,			
			text: "Loading item failed!"
		});			
	}		
	function recorderror(data) {
		playerpopup.show({
			duration: 2000,
			text: "Failed to schedule Recording"
		});	
	}
};