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
	this.itemRecordOn;
	this.seriesRecordOn;
	this.itemRecordOff;
	this.cancelRecord;
	this.seriesRecordOff;
	this.lostfocus;
	this.iterations
};

Item.prototype.close = function(){
	dom.off("body","keydown", this.lostfocus);
	dom.remove("#item")
};

Item.prototype.load = function(id, backstate) {
	var self = this;
    var timerDTO ={
    	RecordAnyTime:true,
    	SkipEpisodesInLibrary:false,
    	RecordAnyChannel:false,
    	KeepUpTo:0,
    	RecordNewOnly:false,
    	Days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    	DayPattern:"Daily",
    	ImageTags:{
    		'Primary': '',
    		'Thumb': ''
    	},
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
 		ParentPrimaryImageTag: "",
 		ParentThumbImageTag: "",
 		ParentThumbItemId: "",
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
    	   emby.getLiveTvSeriesTimers({
  		   success: processItem,
    		   error: error				
    	   });
     }
	function processItem(data) {
		self.timerdata = data;
    	if (typeof (self.tvdata.SeriesTimerId != 'undefined')){
    		var found = false;
        	self.timerdata.Items.forEach (function(item){
        		if ((item.ChannelId == self.tvdata.ChannelId || item.RecordAnyChannel == true ) && item.Id == self.tvdata.SeriesTimerId)
        			found = true
        	})
    		if (!found)
    			delete self.tvdata.SeriesTimerId
    	}

    	now = new Date().toISOString();

		
		if (self.data.Type == "Series" || self.data.Type == "Season")
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
		   if (typeof self.data.ChannelId != 'undefined' && (self.data.StartDate > now || self.data.EndDate < now)) // liveTv item
		   {
			  if (self.data.EndDate > now){ // can only record if show has not ended
		         dom.append("#userViews_0", {
			         nodeName: "a",
			         href: "#",
			         className: "user-views-item user-views-item_0",
			         id: "viewRecord",
			         dataset: {
					      keyUp: "#homeLink a",
					      keyDown: ".user-views-item_1",
					      keyRight: "a.latest-item"	
			         },
			         childNodes: [{
				         nodeName: "span",
				         className: "user-views-item-name glyphicon record",	
				         text: ""				
			         }]
		         });
			      dom.append("#userViews_0", {
				      nodeName: "a",
				      href: "#",
				      className: "user-views-item user-views-item_1",
				      id: "viewStop",
				      dataset: {
						   keyUp: ".user-views-item_0",
						   keyDown: ".user-views-item_0",
						   keyRight: "a.latest-item"	
				      },
				      childNodes: [{
					      nodeName: "span",
					      className: "user-views-item-name glyphicon stop",	
					      text: ""				
				      }]
			      });
			  }
			  else
		         dom.append("#userViews_0", {
			         nodeName: "a",
			         href: "#",
			         className: "user-views-item user-views-item_0",
			         id: "viewStop",
			         dataset: {
					      keyUp: "#homeLink a",
					      keyDown: "#homeLink a",
					      keyRight: "a.latest-item"	
			         },
			         childNodes: [{
				         nodeName: "span",
				         className: "user-views-item-name glyphicon stop",	
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
		   
		   if (self.data.UserData.PlaybackPositionTicks > 0)  // resume data available: show resume button
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
		   
		   if (typeof self.data.ChannelId == 'undefined') // not a liveTv item
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
		      if (self.data.CanDelete == true)
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
		

		
 	    if (typeof self.data.ChannelId != 'undefined') // liveTv item
 	   	   dom.css("#poster", {
 			   backgroundImage: "url(./images/generic-backdrop.png)"
 		   });
 	    else
		if (self.data.BackdropImageTags && self.data.BackdropImageTags[0])
			dom.css("#poster", {
				backgroundImage: "url(" + emby.getImageUrl({'itemId': self.data.Id, tag: self.data.BackdropImageTags[0], imageType: 'Backdrop', height: 1080}) + ")"
			});	
		else 
		if (self.data.ParentBackdropImageTags && self.data.ParentBackdropImageTags[0]) 
			dom.css("#poster", {
				backgroundImage: "url(" + emby.getImageUrl({'itemId': self.data.ParentBackdropItemId, tag: self.data.ParentBackdropImageTags[0], imageType: 'Backdrop', height: 1080}) + ")"
			});				
		
		dom.addClass("#item", "item-view-" + self.data.Type.toLowerCase());
		
		renderer.userItem(self.data,self.tvdata, {
			container: "#itemContent"
		});
		
		switch(self.data.Type) {
			case "Series":
				emby.getShowsSeasons({
					id: self.data.Id,
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
					id: self.data.SeriesId,
					seasonId: self.data.Id,
					fields: "ItemCounts,AudioInfo",	
					success: function(data) {
						data.heading = "Episodes";						
						displayUserItemChildren(data)
					},
					error: error				
				});	
				break;
								
		}	
		
		if (self.data.Type != "Series" && self.data.Type != "Season")
		{
            if (dom.exists("#userViews a:first-child"))
			    focus("#userViews a:first-child");
            else
    			focus(".home-link")
			if (self.data.Video3DFormat == "HalfTopAndBottom")
			   prefs.video3DFormat = "top_bottom"
			else				   
			if (self.data.Video3DFormat == "HalfSideBySide")
			   prefs.video3DFormat = "side_by_side_LR"
			else				   
			if (self.data.Video3DFormat == "FullSideBySide")
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
			self.cancelRecord = false;
            handleRecordRequest()
        });
		dom.on("#viewStop", "click", function(event) {
			event.preventDefault();
			flashButton(event.target);
			self.cancelRecord = true;
            handleRecordRequest()
        });
		dom.on("#viewTogglePlayed", "click", function(event) {
			event.preventDefault()
			if (self.data.UserData.Played == false)
				self.data.UserData.Played = true
			else
				self.data.UserData.Played = false
			prefs.playedStatus = self.data.UserData.Played
			flashButton(event.target);
			emby.updatePlayedStatus({
				Id: id,
				UserData: self.data.UserData,
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
				id: self.data.Id				
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
    		success: getSeriesTimers,
    		error: recorderror
    	})
    }
    function getSeriesTimers(data) {
        self.data = data;
    	emby.getLiveTvSeriesTimers({
  		  success: processRecordState,
    	  error: error				
    	});
     }
    function processRecordState(data){
		self.timerdata = data;
    	if (typeof (self.data.SeriesTimerId != 'undefined')){
    		var found = false;
        	self.timerdata.Items.forEach (function(item){
        		if ((item.ChannelId == self.data.ChannelId || item.RecordAnyChannel == true ) && item.Id == self.data.SeriesTimerId)
        			found = true
        	})
    		if (!found)
    			delete self.data.SeriesTimerId
    	}

    	if (self.data.SeriesTimerId)
    		cancelSeriesRecordTimer(self.data.SeriesTimerId)
    	else
    	if (self.data.TimerId && self.data.IsSeries && !self.cancelRecord)
    		scheduleSeriesRecordTimer()
        else    		
    	if (!self.data.TimerId && !self.cancelRecord)
    	   scheduleItemRecordTimer();
    	else
    	if (self.data.TimerId)
    	   cancelItemRecordTimer(self.data.TimerId);
    }
    function cancelSeriesRecordTimer(TimerId){
        self.itemRecordOn = self.seriesRecordOn = self.itemRecordOff = self.seriesRecordOff = false;
        self.seriesRecordOff = true;
  	   emby.deleteLiveTvSeriesTimer({
 		   id: TimerId,
 		   success: handleResult,
 		   error: recorderror
 	   })
     }
 	function scheduleSeriesRecordTimer(){
        self.itemRecordOn = self.seriesRecordOn = self.itemRecordOff = self.seriesRecordOff = false;
 		self.seriesRecordOn = true;
 		timerDTO.ServerId = self.data.ServerId;
 		timerDTO.ChannelId = self.data.ChannelId;
 		timerDTO.ProgramId = self.data.Id;
 		timerDTO.StartDate = self.data.StartDate;
 		timerDTO.EndDate = self.data.EndDate;
 		timerDTO.Name = self.data.Name;
 		timerDTO.ParentPrimaryImageTag = self.data.ParentPrimaryImageTag;
 		timerDTO.ParentThumbImageTag = self.data.ParentThumbImageTag;
 		timerDTO.ParentThumbItemId = self.data.ParentThumbItemId;
 	    emby.postLiveTvSeriesTimers({
 		    data: timerDTO,
 		    success: handleResult,
 		    error: recorderror
 	     })
 		
 	}
    function cancelItemRecordTimer(TimerId){
       self.itemRecordOn = self.seriesRecordOn = self.itemRecordOff = self.seriesRecordOff = false;
       self.itemRecordOff = true;
 	   emby.deleteLiveTvTimer({
		   id: TimerId,
		   success: handleResult,
		   error: recorderror
	   })
    }
	function scheduleItemRecordTimer(){
        self.itemRecordOn = self.seriesRecordOn = self.itemRecordOff = self.seriesRecordOff = false;
		self.itemRecordOn = true;
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
		self.iterations = 0;
    	emby.getLiveTvProgram({
    		id: self.data.Id,
    		success: updateSeriesTimers,
    		error: recorderror
    	})
	}
    function updateSeriesTimers(data) {
        self.data = data;
    	emby.getLiveTvSeriesTimers({
  		  success: updateItemPage,
    	  error: error				
    	});
     }
	function updateItemPage(data){
		self.timerdata = data
    	if (typeof (self.data.SeriesTimerId != 'undefined')){
    		var found = false;
        	self.timerdata.Items.forEach (function(item){
        		if ((item.ChannelId == self.data.ChannelId || item.RecordAnyChannel == true ) && item.Id == self.data.SeriesTimerId)
        			found = true
        	})
    		if (!found)
    			delete self.data.SeriesTimerId
    	}
		if ((self.data.TimerId && self.itemRecordOn) || (self.data.SeriesTimerId && self.seriesRecordOn) || (!self.data.TimerId && self.itemRecordOff) || (!self.data.SeriesTimerId && self.seriesRecordOff))
		{
			if (self.itemRecordOn && self.data.IsSeries)
				playerpopup.show({
					duration: 1500,
					text: "Click again to record the Series"
				});	
			dom.dispatchCustonEvent(document, "reloadItem", self.data)
	        return
		}
		self.iterations++
		if (self.iterations > 50){
			dom.dispatchCustonEvent(document, "reloadItem", self.data)
	        return
		}
    	emby.getLiveTvProgram({
    		id: self.data.Id,
    		success: updateSeriesTimers,
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
			if (dom.exists(".latest-item"))
                focus(".latest-item");
			else
				focus(".home-link");
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
		if (elmnts){
		    var focusid = "#"+elmnts[prefs.lastEpisodeFocus].id
		    prefs.lastEpisodeFocus = null;
            focus(focusid);
		}
		else
			focus(".home-link")
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
		playerpopup.show({
			duration: 2000,			
			text: "Item no longer Available"
		});			
		history.back();
	}		
	function recorderror(data) {
		playerpopup.show({
			duration: 2000,
			text: "Failed to schedule Recording"
		});	
	}
};