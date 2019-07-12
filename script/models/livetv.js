// Author: Kevin Wilcox
// Modifed: 02/06/2019
// The Paradigm Grid
// --------------------------------------------

function LiveTv() {
	this.total = 0;
	this.count = 0;
	this.timer = null;
	this.timer2 = null;
	
	this.startIndex;
	this.timersValid
	this.currentIndex;
	this.itemIndex;
	this.limit;
	this.scroll;
	this.dataLoaded = false;
	this.data = {};
	this.timerdata = {};
	this.itemtimerdata = {};
	this.timerarray = [];
	this.newdata = { 
		Items:[]
    }
	this.totalRecordCount;
	
	this.id;
	this.activeButton;
	this.lastButton;
	this.heading;
	this.lostfocus;
	this.lastItemIndex;
	this.lastItemPosition;
};

LiveTv.prototype.close = function() {
	var self = this;
	dom.remove("#collectionIndex");
	dom.remove("playerBackdrop")
	dom.off("#view", "scroll", this.scroll);
	dom.off("body","keydown", this.lostfocus);
}
LiveTv.prototype.load = function(settings, backstate) {
	settings = settings || {};
	
	var self = this;
	self.timersValid = false;
	self.activeButton = settings.activeButton || 1
	self.heading = self.activeButton == 1 ? "On Now" 
			     : self.activeButton == 2 ? "Next Up" 
			     : self.activeButton == 3 ? prefs.showDays == 1 ? "Next 24 Hours" : "Next "+prefs.showDays+' Days' 
			     : self.activeButton == 4 ? "Movies" 
			     : "Scheduled Tasks" 
	this.total = 5;
	this.count = 0;

	this.limit = settings.limit || 50;
	this.startIndex = 0;
    var scrollLeft = 0;	
	var columnLast = 0;
	var columnWidth = 0;
	var columnLimit = Math.floor(this.limit / 2);
	var menuWidth = 0;	
	var columnViewportCount = 0;
	var indexCurrent = "";
	var idx = 0;
	
	this.id = guid.create();
	var token = guid.create();	

	
	dom.hide("#server");
	dom.hide("#user");
	dom.show("#details")
	dom.show("#homeLink");

	self.close()
	
	dom.css("#poster", {
		backgroundImage: "url(./images/generic-backdrop.png)"
	});
	
	dom.remove("#spinnerBackdrop")
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
	dom.hide('#spinnerBackdrop')

	dom.html("#view", {
		nodeName: "div",
		className: "collection-view",
		id: "collection",
		childNodes: [{
			nodeName: "div",
			className: "user-views-column",
			id: "userViews_0"
		}]
	});	

	dom.append("body", {
		nodeName: "div",
		id: "collectionIndex",
		className: "collection-index",
		dataset: {lastFocus: "#index-1"},
		childNodes: [{
			nodeName: "a",
			id: "index-1",
			className: "index-item",
			text: "#",
			href: "#",
			dataset: {
				index: "sym"
			}
		}, {
			nodeName: "a",
			id: "index-2",			
			className: "index-item",
			text: "A",
			href: "#",
			dataset: {
				index: "A"
			}
		}, {
			nodeName: "a",
			id: "index-3",
			className: "index-item",
			text: "B",
			href: "#",
			dataset: {			
				index: "B"
			}
		}, {
			nodeName: "a",
			id: "index-4",
			className: "index-item",
			text: "C",
			href: "#",
			dataset: {				
				index: "C"
			}
		}, {
			nodeName: "a",
			id: "index-5",
			className: "index-item",
			text: "D",
			href: "#",
			dataset: {				
				index: "D"
			}
		}, {
			nodeName: "a",
			id: "index-6",
			className: "index-item",
			text: "E",
			href: "#",
			dataset: {				
				index: "E"
			}
		}, {
			nodeName: "a",
			id: "index-7",
			className: "index-item",
			text: "F",
			href: "#",
			dataset: {				
				index: "F"
			}
		}, {
			nodeName: "a",
			id: "index-8",
			className: "index-item",
			text: "G",
			href: "#",
			dataset: {				
				index: "G"
			}
		}, {
			nodeName: "a",
			id: "index-9",
			className: "index-item",
			text: "H",
			href: "#",
			dataset: {				
				index: "H"
			}
		}, {
			nodeName: "a",
			id: "index-10",
			className: "index-item",
			text: "I",
			href: "#",
			dataset: {				
				index: "I"
			}
		}, {
			nodeName: "a",
			id: "index-11",
			className: "index-item",
			text: "J",
			href: "#",
			dataset: {					
				index: "J"
			}
		}, {
			nodeName: "a",
			id: "index-12",
			className: "index-item",
			text: "K",
			href: "#",
			dataset: {				
				index: "K"
			}
		}, {
			nodeName: "a",
			id: "index-13",
			className: "index-item",
			text: "L",
			href: "#",
			dataset: {				
				index: "L"
			}
		}, {
			nodeName: "a",
			id: "index-14",
			className: "index-item",
			text: "M",
			href: "#",
			dataset: {
				index: "M"
			}
		}, {
			nodeName: "a",
			id: "index-15",
			className: "index-item",
			text: "N",
			href: "#",
			dataset: {
				index: "N"
			}
		}, {
			nodeName: "a",
			id: "index-16",
			className: "index-item",
			text: "O",
			href: "#",
			dataset: {
				index: "O"
			}
		}, {
			nodeName: "a",
			id: "index-17",
			className: "index-item",
			text: "P",
			href: "#",
			dataset: {
				index: "P"
			}
		}, {
			nodeName: "a",
			id: "index-18",
			className: "index-item",
			text: "Q",
			href: "#",
			dataset: {
				index: "Q"
			}
		}, {
			nodeName: "a",
			id: "index-19",
			className: "index-item",
			text: "R",
			href: "#",
			dataset: {
				index: "R"
			}
		}, {
			nodeName: "a",
			id: "index-20",
			className: "index-item",
			text: "S",
			href: "#",
			dataset: {
				index: "S"
			}
		}, {
			nodeName: "a",
			id: "index-21",
			className: "index-item",
			text: "T",
			href: "#",
			dataset: {
				index: "T"
			}
		}, {
			nodeName: "a",
			id: "index-22",
			className: "index-item",
			text: "U",
			href: "#",
			dataset: {
				index: "U"
			}
		}, {
			nodeName: "a",
			id: "index-23",
			className: "index-item",
			text: "V",
			href: "#",
			dataset: {
				index: "V"
			}
		}, {
			nodeName: "a",
			id: "index-24",
			className: "index-item",
			text: "W",
			href: "#",
			dataset: {
				index: "W"
			}
		}, {
			nodeName: "a",
			id: "index-25",
			className: "index-item",
			text: "X",
			href: "#",
			dataset: {
				index: "X"
			}
		}, {
			nodeName: "a",
			id: "index-26",
			className: "index-item",
			text: "Y",
			href: "#",
			dataset: {
				index: "Y"
			}
		}, {
			nodeName: "a",
			id: "index-27",
			className: "index-item",
			text: "Z",
			href: "#",
			dataset: {
				index: "Z"
			}
		}]
	})
    var buttonidx = 0
    dom.append("#userViews_0", {
	     nodeName: "a",
	     href: "#",
	     className: "user-views-item user-views-item_" + ++buttonidx,
	     id: "viewItem_0_"+buttonidx,
	     dataset: {
	         keyUp: "#homeLink a",
		     keyDown: ".user-views-item_"+ (buttonidx+1),
		     keyRight: "a.latest-item"	
		 },
		 childNodes: [{
		      nodeName: "span",
		      className: "user-views-item-name",	
		      text: "On Now"				
	     }]
	});		
    dom.append("#userViews_0", {
	     nodeName: "a",
	     href: "#",
	     className: "user-views-item user-views-item_" + ++buttonidx,
	     id: "viewItem_0_"+buttonidx,
	     dataset: {
	         keyUp: ".user-views-item_"+ (buttonidx-1),
		     keyDown: ".user-views-item_"+ (buttonidx+1),
		     keyRight: "a.latest-item"	
		 },
		 childNodes: [{
		      nodeName: "span",
		      className: "user-views-item-name",	
		      text: "Next Up"				
	     }]
	});		
    dom.append("#userViews_0", {
	     nodeName: "a",
	     href: "#",
	     className: "user-views-item user-views-item_" + ++buttonidx,
	     id: "viewItem_0_"+buttonidx,
	     dataset: {
	         keyUp: ".user-views-item_"+ (buttonidx-1),
		     keyDown: ".user-views-item_"+ (buttonidx+1),
		     keyRight: "a.latest-item"	
		 },
		 childNodes: [{
		      nodeName: "span",
		      className: "user-views-item-name",	
		      text: "Shows"				
	     }]
	});		
    dom.append("#userViews_0", {
	     nodeName: "a",
	     href: "#",
	     className: "user-views-item user-views-item_" + ++buttonidx,
	     id: "viewItem_0_"+buttonidx,
	     dataset: {
	         keyUp: ".user-views-item_"+ (buttonidx-1),
		     keyDown: ".user-views-item_"+ (buttonidx+1),
		     keyRight: "a.latest-item"	
		 },
		 childNodes: [{
		      nodeName: "span",
		      className: "user-views-item-name",	
		      text: "Movies"				
	     }]
	});		
    dom.append("#userViews_0", {
	     nodeName: "a",
	     href: "#",
	     className: "user-views-item user-views-item_" + ++buttonidx,
	     id: "viewItem_0_"+buttonidx,
	     dataset: {
	         keyUp: ".user-views-item_"+ (buttonidx-1),
		     keyDown: "#index-1",
		     keyRight: "a.latest-item"	
		 },
		 childNodes: [{
		      nodeName: "span",
		      className: "user-views-item-name",	
		      text: "Tasks"				
	     }]
	});
    dom.addClass('.user-views-item_'+self.activeButton,'activeButton')

	this.lostfocus = dom.on("body", "keydown", lostFocus);
	this.scroll = dom.on("#view", "scroll", scrolling);
			
// button handlers
	
	dom.delegate("#collection", "a.user-views-item_1", "click", function(event) {
		event.stopPropagation()
		event.preventDefault()
		flashButton(event.target)
		self.lastItemIndex = null;
		self.dataLoaded = false;
		dom.removeClass('.user-views-item','activeButton');
		dom.addClass('#viewItem_0_1','activeButton')
		var dataset = {}
		dataset.activeButton = 1;
		dom.dispatchCustonEvent(document, "liveTvCollectionSelected", dataset);
	});	

	dom.delegate("#collection", "a.user-views-item_2", "click", function(event) {
		event.stopPropagation()
		event.preventDefault()
		flashButton(event.target)
		self.lastItemIndex = null;
		self.dataLoaded = false;
		dom.removeClass('.user-views-item','activeButton');
		dom.addClass('#viewItem_0_2','activeButton')
		var dataset = {}
		dataset.activeButton = 2;
		dom.dispatchCustonEvent(document, "liveTvCollectionSelected", dataset);
	});	

	dom.delegate("#collection", "a.user-views-item_3", "click", function(event) {
		event.stopPropagation()
		event.preventDefault()
		flashButton(event.target)
		self.lastItemIndex = null;
		self.dataLoaded = false;
		dom.removeClass('.user-views-item','activeButton');
		dom.addClass('#viewItem_0_3','activeButton')
		var dataset = {}
		dataset.activeButton = 3;
		dom.dispatchCustonEvent(document, "liveTvCollectionSelected", dataset);
	});	

	dom.delegate("#collection", "a.user-views-item_4", "click", function(event) {
		event.stopPropagation()
		event.preventDefault()
		flashButton(event.target)
		self.lastItemIndex = null;
		self.dataLoaded = false;
		dom.removeClass('.user-views-item','activeButton');
		dom.addClass('#viewItem_0_4','activeButton')
		var dataset = {}
		dataset.activeButton = 4
		dom.dispatchCustonEvent(document, "liveTvCollectionSelected", dataset);
	});	

	dom.delegate("#collection", "a.user-views-item_5", "click", function(event) {
		event.stopPropagation()
		event.preventDefault()
		flashButton(event.target)
		self.lastItemIndex = null;
		self.dataLoaded = false;
		dom.removeClass('.user-views-item','activeButton');
		dom.addClass('#viewItem_0_5','activeButton')
		var dataset = {}
		dataset.activeButton = 5;
		self.lastButton = self.activeButton
		dom.dispatchCustonEvent(document, "liveTvCollectionSelected", dataset);
	});	

	//collection handlers
	dom.delegate("#collection", "a.latest-item", "click", function(event) {
		event.stopPropagation()
		event.preventDefault()
		self.lastItemIndex = event.delegateTarget.dataset.index;
		self.lastItemPosition = document.getElementById("view").scrollLeft;
		if (self.activeButton == 5 && event.delegateTarget.dataset.seriestimer != 'undefined'){
			var dataset = {}
			dataset.name = event.delegateTarget.dataset.name;
			dataset.sortName = event.delegateTarget.dataset.sortname
			dataset.id = event.delegateTarget.dataset.id;
			dataset.seriestimer = event.delegateTarget.dataset.seriestimer;
			dataset.activeButton = self.activeButton;
			dom.dispatchCustonEvent(document, "LiveTvItemsSelected", dataset);
		}
		else
		if (countEpisodes(event.delegateTarget.dataset.name) > 1){
			var dataset = {}
			dataset.name = event.delegateTarget.dataset.name;
			dataset.sortName = event.delegateTarget.dataset.sortname
			dataset.id = event.delegateTarget.dataset.id;
			prefs.data = self.data
			dataset.activeButton = self.activeButton;
			dom.dispatchCustonEvent(document, "LiveTvItemsSelected", dataset);
		}
		else{
		    var dataset = {}
		    dataset.id = event.delegateTarget.dataset.id
		    dataset.timersValid = self.timersValid
		    dom.dispatchCustonEvent(document, "mediaItemSelected", dataset);
		}
	});	

	dom.delegate("#collection", "a", "keydown", navigation);
	
	dom.on("#collectionIndex a", "click", scrollToIndex);
	
	dom.on("#collectionIndex a", "keyup", scrollToIndex);
	
	dom.on("#collectionIndex a", "keydown", indexNavigation);

	var now = new Date().toISOString();
	var today = new Date()
	var tomorrow = new Date()
	var prefsDays = new Date()
	tomorrow.setHours(24,0,0,0);
	prefsDays.setHours((24*prefs.showDays),0,0,0)
    today.setTime(today.getTime() + 60*60*1000)
    today = today.toISOString()
	tomorrow = tomorrow.toISOString();
	prefsDays = prefsDays.toISOString();
    if (self.activeButton == 1)
 	   emby.getLiveTvPrograms({
 		   HasAired: 'false',
 		   MaxStartDate: now,
 		   success: displayUserItems,
 		   error: error				
 	   });
     else
    if (self.activeButton == 2)
	   emby.getLiveTvPrograms({
		   HasAired: 'false',
		   MinStartDate: now,
		   MaxStartDate: today,
		   success: displayUserItems,
		   error: error				
	   });
    else
    if (self.activeButton == 3){
    	if (self.dataLoaded)
    		displayUserItems(self.data)
        else{
        	dom.show('#spinnerBackdrop')
		    self.dataLoaded = true;
			
   	       emby.getLiveTvPrograms({
   		       HasAired: 'false',
   		       MinStartDate: now,
   		       MaxStartDate: prefsDays,
   		       isSeries: true,
   		       success: displayUserItems,
   		       error: error				
   	       });
        }
    }
    else
    if (self.activeButton == 4)
   	   emby.getLiveTvPrograms({
   		   HasAired: 'false',
   		   isMovie: true,
   		   success: displayUserItems,
   		   error: error				
   	   });
    else
    if (self.activeButton == 5)
   	   emby.getLiveTvSeriesTimers({
   		   success: assembleSeriesTimers,
   		   error: error				
   	   });
	
    function assembleSeriesTimers(data){
        self.newdata.Items = [];
        self.timerarray = []
    	data.Items.forEach(function(item, index) {
   		    var timerItem = {};
    		timerItem.ProgramId = item.ProgramId;
    		timerItem.ChannelId = item.ChannelId;
    		timerItem.TimerId = item.Id;
    		timerItem.IsSeriesTimer = true;
    		timerItem.StartDate = item.StartDate;
    		timerItem.ParentPrimaryImageItemId = item.ParentPrimaryImageItemId;
    		self.timerarray.push(timerItem);
    	})
   	    emby.getLiveTvTimers({
       		   success: assembleItemTimers,
       		   error: error				
        });
    }
    function assembleItemTimers(data){
    	data.Items.forEach(function(item, index) {
    		if ((item.Status == 'InProgress' || item.Status == 'New') && !item.SeriesTimerId){
        		var timerItem = {};
    		    timerItem.ProgramId = item.ProgramId;
    		    timerItem.ChannelId = item.ChannelId;
    		    timerItem.TimerId = item.Id
    		    timerItem.IsSeriesTimer = false
    		    self.timerarray.push(timerItem);
    		}
    	})
    	self.itemIndex = 0;
    	if (self.timerarray.length < 1){
			playerpopup.show({
				duration: 2000,
				text: "There are no recordings scheduled"
			});	
            focus(".activeButton");
			return;
    	}
    	self.timersValid = true;
 	    emby.getLiveTvProgram({
   	       id: self.timerarray[0].ProgramId,
       	   success: pushItemData,
       	   error: discarderror				
       });
    	
    }
    function pushItemData(data){
    	var tdata = {};
    	tdata = data;
    	if (tdata.ChannelId = self.timerarray[self.itemIndex].ChannelId){
    	   if (self.timerarray[self.itemIndex].IsSeriesTimer){
    	      tdata["SeriesTimerId"] = self.timerarray[self.itemIndex].TimerId;
    	      tdata.Overview = '';
    	      tdata.Id = self.timerarray[self.itemIndex].ParentPrimaryImageItemId
    	   }
    	   else
    	      tdata["TimerId"] = self.timerarray[self.itemIndex].TimerId;	
    	   self.newdata.Items.push(tdata);
    	}
    	self.itemIndex++;
    	if (self.itemIndex >= self.timerarray.length){
    		// Sort items by name
    		var length = self.newdata.Items.length
    	    for (var j = 0; j < length; j++)
    	        for (var i=0; i < (length - j - 1); i++)
    	            if (self.newdata.Items[i].Name > self.newdata.Items[i+1].Name)
    	            {
    	               temp = self.newdata.Items[i];
    	               self.newdata.Items[i] = self.newdata.Items[i+1];
    	               self.newdata.Items[i+1] = temp;
    	            }
    		displayUserItems(self.newdata)
    		return
    	}
 	    emby.getLiveTvProgram({
   	        id: self.timerarray[self.itemIndex].IsSeriesTimer? self.timerarray[self.itemIndex].ParentPrimaryImageItemId : self.timerarray[self.itemIndex].ProgramId,
        	success: pushItemData,
        	error: cantfixerror				
        });
    }
	function cantfixerror(data){
    	self.itemIndex++;
    	if (self.itemIndex >= self.timerarray.length){
    		displayUserItems(self.newdata)
    		return
    	}
 	    emby.getLiveTvProgram({
   	        id: self.timerarray[self.itemIndex].ProgramId,
        	success: pushItemData,
        	error: discarderror				
        });
	}

    function setTimers(idx){
	    if (typeof self.data.Items[idx].SeriesTimerId != 'undefined')
	    	setSeriesTimer(idx);
	    if (typeof self.data.Items[idx].SeriesTimerId == 'undefined')
 		    checkForSeriesTimer(idx)
	    if (typeof self.data.Items[idx].TimerId != 'undefined')
	    	setItemTimer(idx);
	    if (typeof self.data.Items[idx].TimerId == 'undefined')
	        checkForItemTimer(idx)
    }
    function checkForSeriesTimer(idx){
    	self.timerdata.Items.forEach (function(item){
    		var time1 = new Date(item.StartDate).getTime();
    		var time2 = new Date(self.data.Items[idx].StartDate).getTime()
      		if ((item.ChannelId == self.data.Items[idx].ChannelId || item.RecordAnyChannel == true ) && item.Id == self.data.Items[idx].SeriesTimerId){
    		//if (item.ChannelId == self.data.Items[idx].ChannelId && time1 == time2){
    			self.data.Items[idx]['SeriesTimerId'] = item.Id
    		}
    	})
    }	
    function checkForItemTimer(idx){
    	self.itemtimerdata.Items.forEach (function(item){
    		if ((item.Status == "New" || item.Status == 'InProgress') && item.ChannelId == self.data.Items[idx].ChannelId && item.ProgramId == self.data.Items[idx].Id)
    			self.data.Items[idx]['TimerId'] = item.Id
    	})
    }	
	
	function setItemTimer(idx){
		var found = false;
    	self.itemtimerdata.Items.forEach (function(item){
    		if (item.ChannelId == self.data.Items[idx].ChannelId && item.Id == self.data.Items[idx].TimerId && (item.Status == "New" || item.Status == 'InProgress'))
    			found = true
    	})
		if (!found)
			delete self.data.Items[idx].TimerId
    }
	
	function setSeriesTimer(idx){
		var found = false;
    	self.timerdata.Items.forEach (function(item){
    		var time1 = new Date(item.StartDate).getTime();
    		var time2 = new Date(self.data.Items[idx].StartDate).getTime()
      		if ((item.ChannelId == self.data.Items[idx].ChannelId || item.RecordAnyChannel == true ) && item.Id == self.data.Items[idx].SeriesTimerId)
    		//if (item.ChannelId == self.data.Items[idx].ChannelId && time1 == time2)
    			found = true
    	})
		if (!found)
			delete self.data.Items[idx].SeriesTimerId
    }
	function countEpisodes(name){
		var count=0;
		for (var x=0; x< self.data.Items.length;x++)
			if (self.data.Items[x].Name == name)
				count++;
		return count
    	
    }
	
	function formatDate(isoDate) {
    	  var monthNames = [
	          "Jan", "Feb", "Mar",
    	      "Apr", "May", "Jun", "Jul",
    	      "Aug", "Sep", "Oct",
    	      "Nov", "Dec"
    	                  ];
    	  var date = new Date(isoDate)
    	  var day = date.getDate();
    	  var monthIndex = date.getMonth();
    	  var hours = date.getHours();
    	  var minutes = date.getMinutes();
    	  var ampm = hours >= 12 ? 'pm' : 'am';
    	  hours = hours % 12;
    	  hours = hours ? hours : 12; // the hour '0' should be '12'
    	  minutes = minutes < 10 ? '0'+minutes : minutes;
    	  var strTime = hours + ':' + minutes + ' ' + ampm;
    	  return monthNames[monthIndex]+' '+ day + ' / ' + strTime;
    }

    function displayUserItems(data) {
       self.data = data;
   	   emby.getLiveTvSeriesTimers({
 		   success: getLiveTvItemTimers,
   		   error: error				
   	   });
    }
    function getLiveTvItemTimers (timerdata){
    	self.timerdata = timerdata
    	   emby.getLiveTvTimers({
     		   success: processUserItems,
       		   error: error				
       	   });
    }
    function processUserItems(timerdata){
    	self.itemtimerdata = timerdata
		// get shows and remove duplicates.
		var now = new Date().toISOString()
		var newdata = {
			Items:[],
			TotalRecordCount:0
		}
        
	    // set timers
        for (var i = 0; i < self.data.Items.length ; i++){
    	    setTimers(i)
        }
	    
	    self.data.Items[self.data.Items.length] = {Name: "DummyItemName"}
	    var item = self.data.Items[0]
	    
		if (self.activeButton == 1) // get in-progress shows
		{
		   for (var x = 0; x < self.data.Items.length-1;x++){
			   if (typeof self.data.Items[x].SeriesTimerId != 'undefined' && self.data.Items[x].Name == item.Name)			   
				   item = self.data.Items[x]
			   else
			   if (typeof self.data.Items[x].TimerId != 'undefined' && self.data.Items[x].Name == item.Name && typeof item.SeriesTimerId == 'undefined')
				   item = self.data.Items[x]
			   if (self.data.Items[x].StartDate < now && self.data.Items[x].Name != self.data.Items[x+1].Name){
				   newdata.Items[newdata.Items.length] = item
				   item = self.data.Items[x+1]
			   }
		   }
		}
		else
		if (self.activeButton == 2) // get next-up shows
		{
		   var onehourlater = new Date()
		   onehourlater.setTime(onehourlater.getTime() + 60*60*1000)
		   onehourlater = onehourlater.toISOString()
		   for (var x = 0; x < self.data.Items.length-1;x++){
			   if (typeof self.data.Items[x].SeriesTimerId != 'undefined' && self.data.Items[x].Name == item.Name)			   
				   item = self.data.Items[x]
			   else
			   if (typeof self.data.Items[x].TimerId != 'undefined' && self.data.Items[x].Name == item.Name && typeof item.SeriesTimerId == 'undefined')
				   item = self.data.Items[x]
			   if (self.data.Items[x].StartDate > now && self.data.Items[x].StartDate < onehourlater && self.data.Items[x].Name != self.data.Items[x+1].Name){
				   newdata.Items[newdata.Items.length] = item
				   item = self.data.Items[x+1]
			   }
		   }
		}
		else 
		if (self.activeButton == 3 || self.activeButton == 4) // just remove duplicates
        {			
		   for (var x = 0; x < self.data.Items.length-1;x++){
			   if (typeof self.data.Items[x].SeriesTimerId != 'undefined' && self.data.Items[x].Name == item.Name)			   
				   item = self.data.Items[x]
			   else
			   if (typeof self.data.Items[x].TimerId != 'undefined' && self.data.Items[x].Name == item.Name && typeof item.SeriesTimerId == 'undefined')
				   item = self.data.Items[x]
			   if (item.Name != self.data.Items[x+1].Name){
				   newdata.Items[newdata.Items.length] = item
				   item = self.data.Items[x+1]
			   }
		   }
        }
		else
		   for (var x = 0; x < self.data.Items.length-1;x++) // may have duplicates
 		      newdata.Items[newdata.Items.length] = self.data.Items[x]
		
		newdata.TotalRecordCount = newdata.Items.length;
				  

		
	    dom.hide('#spinnerBackdrop')
		
	    self.id = guid.create();
									
		if (newdata.Items.length > 0) {					
			renderer.userAllTvItemsPlaceholder(newdata, {
				container: "#collection",
				id: self.id,
				heading: self.heading,
				headerLink: "#homeLink a",
				initialise: true
			});
			renderer.userAllTvItemsImages(0,10*device.columnWidth,self.id) // images for first 20
		}	
		
		if (backstate == false || self.lastItemIndex == null)
            focus(".activeButton");
		else
			restoreCollectionFocus();
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
	function restoreCollectionFocus(){
		var position = self.lastItemPosition -(device.columnWidth*3)
		document.getElementById("view").scrollLeft = self.lastItemPosition;
		var nodes = dom.querySelector('#'+self.id).childNodes;
		nodes = Array.prototype.slice.call(nodes);
		var found = false;
		for(var x = 0;x<nodes.length;x++){
			if( dom.data(nodes[x],"location") > position){
				var childnodes = nodes[x].childNodes
				childnodes = Array.prototype.slice.call(childnodes);
				childnodes.forEach(function(cnode){
				   if (dom.data(cnode,"index") == self.lastItemIndex){
					   highlightIndex(dom.data(cnode,"sortname").charAt(0).toUpperCase())
				       focus(cnode)
				       found = true;
				   }
				})
			}
			if (found)
				break;
		}
			
		self.lastItemIndex = self.lastItemPosition = null;
	}

	function lostFocus(event) {
		if (dom.exists("#screenplaySettings") || dom.exists("#player") || dom.exists("#validaterequest"))
			return;
		if (event.target.tagName != "A") 
   	       if (self.lastItemIndex == null)
   	    	   if (dom.exists(".latest-item"))
                   focus(".latest-item");
   	    	   else
   	    		   focus(".homelink")
	       else
		       restoreCollectionFocus();
	}   

	function navigation(event) {
		event.preventDefault();
		var self = event.delegateTarget;

		if (event.which == keys.KEY_OK) {
			event.stopPropagation();
			self.click();
			return;
		}
	    switch (event.which) {
		   case keys.KEY_LEFT: 
			   dom.data(self, "keyLeft") ? focus(dom.data(self, "keyLeft").replace("%previous%", ".activeButton")) : ''
			   break;
		   case keys.KEY_UP: 
			   focus(dom.data(self, "keyUp"));
			   break;
		   case keys.KEY_RIGHT: 
			   focus(dom.data(self, "keyRight"));
			   break;
		   case keys.KEY_DOWN: 
			   var down = dom.data(self, "keyDown");
			   focus(down == "%index%" ? dom.data("#collectionIndex", "lastFocus") : down);
			   break;																	
		}
	}

	function indexNavigation(event) {
		event.preventDefault();
		//event.stopPropagation();
				
		if (event.which == keys.KEY_OK) {
			this.click();
			return;
		}
				
		var index = Number(this.id.substr(6));
	
		switch (event.which) {
			case keys.KEY_LEFT: 
				index == 1 ? indexFocus(".activeButton") : indexFocus("#index-" + (index-1));
				break;
			case keys.KEY_UP: 
				collectionFocus();
				break;
			case keys.KEY_RIGHT: 
				indexFocus("#index-" + (index+1));
				break;										
		}
	}
	
	function scrolling(event) {
		var view = dom.querySelector("#view");
		renderer.userAllTvItemsImages(view.scrollLeft-(device.columnWidth*3),view.scrollLeft+10*(device.columnWidth),self.id)
	}
	function scrollToIndex(event) {
		event.stopPropagation()
		event.preventDefault()
		var index = event.currentTarget.dataset.index;
		if (index == 'sym')
			index = ' ';
		if (/^[0-9]$/.test(index))
			index = 'sym'
		self.currentIndex = index;
		var scrollpos = 0;
		
		dom.data("#collectionIndex", "lastFocus", "#collectionIndex a[data-index='" + index + "']");

		var elmnts = Array.prototype.slice.call(dom.querySelectorAll(".latest-items-column-abs"),0);
        for(var a=0;a<elmnts.length;a++)
        	if (elmnts[a].dataset.index == 'sym')
        		elmnts[a].dataset.index = ' ';
		for (var x=0;x<elmnts.length && elmnts[x].dataset.index < index;x++)
			scrollpos = elmnts[x].dataset.location;

		if (self.timer != null){
		   clearTimeout(self.timer);
		   self.timer = null;
		}
		self.timer = setTimeout(function(){
			var view = dom.querySelector("#view");
	        view.scrollLeft = scrollpos;			
		},500)
		
	}
	
	function focus(query) {
		var node = dom.focus(query);
		
		if (node && node.id) {
			if (node.classList.contains("latest-item") || node.classList.contains("user-views-item")) {
				dom.data("#view", "lastFocus", "#" + node.id);
			}
			if (dom.hasClass(node, "latest-item"))
				showDetails(node)
			else 
				dom.empty("#details");
		}
		
	}
	function showDetails(node){
		if (self.timer2 != null){
			   clearTimeout(self.timer2);
			   self.timer2 = null;
			}
			self.timer2 = setTimeout(function(){
				highlightIndex(dom.data(node,"sortname").charAt(0).toUpperCase())
				var year = dom.data(node, "year") || "";
				var runtime = Number(dom.data(node, "runtime")) || 0;
				var startdate = dom.data(node, "startdate") || "";
				var hours = (runtime >= 60 ? Math.floor(runtime/60) + " hr " : "");
				var mins = (runtime % 60 > 0 ? runtime % 60 + " min" : "");
												
				dom.html("#details", {
					nodeName: "div",
					childNodes: [{
						nodeName: "div",
						className: "title",
						text: countEpisodes(dom.data(node, "name")) > 1 ? countEpisodes(dom.data(node, "name")) + " Selections" : (dom.data(node, "episode") ? dom.data(node, "episode").split(';')[0] : dom.data(node,"name"))
					}, {
						nodeName: "div",
						className: "subtitle",
						text: year + (runtime ? " / " + hours + mins : "") + (countEpisodes(dom.data(node, "name")) < 2 ? (startdate ? " / " + formatDate(startdate) : "") : "")			
					}]
				});
				
			},300)
		
	}

	function error(data) {
		message.show({
			messageType: message.error,			
			text: "Loading user livetv summary failed!"
		});			
	}			
	function highlightIndex(index) {
		dom.removeClass(".index-item", "index-current");
		if (index == ' ')
			index = 'sym';
		if (/^[0-9]$/.test(index))
			index = 'sym'
		if (index == "sym") {
			dom.addClass("#index-1", "index-current");
			dom.data("#collectionIndex", "lastFocus", "#index-1");
		} else {
			dom.addClass("#collectionIndex a[data-index='" + index + "']", "index-current");
			dom.data("#collectionIndex", "lastFocus", "#collectionIndex a[data-index='" + index + "']");	
		}
		self.currentIndex = index;
	}
	
	function indexFocus(query) {
		var node = dom.focus(query);
		if (node && node.id) {
			if (node.classList.contains("index-item")) {
				highlightIndex(dom.data(node,"index"))
				dom.data("#collectionIndex", "lastFocus", "#" + node.id);
			}
			if (dom.hasClass(node, "latest-item")) {
				var year = dom.data(node, "year") || "";
				var runtime = dom.data(node, "runtime") || "";
				var startdate = dom.data(node, "startdate") || "";
				var hours = (runtime >= 60 ? Math.floor(runtime/60) + " hr " : "");
				var mins = (runtime % 60 > 0 ? runtime % 60 + " min" : "");
												
				dom.html("#details", {
					nodeName: "div",
					childNodes: [{
						nodeName: "div",
						className: "title",
						text: countEpisodes(dom.data(node, "name")) > 1 ? countEpisodes(dom.data(node, "name")) + " Selections" : (dom.data(node, "episode") ? dom.data(node, "episode").split(';')[0] : dom.data(node,"name"))
					}, {
						nodeName: "div",
						className: "subtitle",
						text: year + (runtime ? " / " + hours + mins : "") + (countEpisodes(dom.data(node, "name")) < 2 ? (startdate ? " / " + formatDate(startdate) : "") : "")			
					}]
				});
			} else {
				dom.empty("#details");
			}			
		}
	}
					
	function collectionFocus() {
		
	    // find match
		var elmnts = Array.prototype.slice.call(dom.querySelectorAll(".latest-items-column-abs"),0);
	    var index = self.currentIndex;
	    var node,idx,lastidx;
		if (index == "sym")
			index = ' ';
	    for(idx = 0; idx < elmnts.length && elmnts[idx].dataset.index < index; idx++)
	        lastidx = idx;
	    if (lastidx == null){
		    node = dom.querySelector("#"+elmnts[0].id.substring(2)+"_0")
	    }
	    else	    
		if (idx < elmnts.length && elmnts[idx].dataset.index == index)
		{
			if (idx > 0)
			{
		        node = dom.querySelector("#"+elmnts[idx-1].id.substring(2)+"_1")
		        if (node.dataset.name.substring(0,1) != index)
			        node = dom.querySelector("#"+elmnts[idx].id.substring(2)+"_0")
			}
			else
		        node = dom.querySelector("#"+elmnts[idx].id.substring(2)+"_0")
		}
		else
		{
	        node = dom.querySelector("#"+elmnts[lastidx].id.substring(2)+"_1")
		    if (!node || node.dataset.name.substring(0,1) > index)
		        node = dom.querySelector("#"+elmnts[lastidx].id.substring(2)+"_0")
		}
		   
		
		if (node){
		    focus(node);
		}
		else
		{
			playerpopup.show({
				duration: 2000,
				text: "There are no items in this collection"
			});	
		}

		if (node && node.id) {
			if (node.classList.contains("index-item")) {
				dom.data("#collectionIndex", "lastFocus", "#" + node.id);
			}
			if (dom.hasClass(node, "latest-item")) {
				highlightIndex(dom.data(node,"sortname").charAt(0).toUpperCase())
				var year = dom.data(node, "year") || "";
				var runtime = dom.data(node, "runtime") || "";
				var startdate = dom.data(node, "startdate") || "";
				var hours = (runtime >= 60 ? Math.floor(runtime/60) + " hr " : "");
				var mins = (runtime % 60 > 0 ? runtime % 60 + " min" : "");
												
				dom.html("#details", {
					nodeName: "div",
					childNodes: [{
						nodeName: "div",
						className: "title",
						text: countEpisodes(dom.data(node, "name")) > 1 ? countEpisodes(dom.data(node, "name")) + " Selections" : (dom.data(node, "episode") ? dom.data(node, "episode").split(';')[0] : dom.data(node,"name"))
					}, {
						nodeName: "div",
						className: "subtitle",
						text: year + (runtime ? " / " + hours + mins : "") + (countEpisodes(dom.data(node, "name")) < 2 ? (startdate ? " / " + formatDate(startdate) : "") : "")			
					}]
				});
			} else {
				dom.empty("#details");
			}			
		}
	}
};