// Author: Kevin Wilcox
// Modifed: 02/06/2019
// The Paradigm Grid
// --------------------------------------------

function LiveTvItems() {
	this.total = 0;
	this.count = 0;
	
	this.startIndex;
	this.currentIndex;
	this.limit;
	this.scroll;
	this.node;
	this.data = {};
	this.timerdata = {};
	this.channeldata = {}
	this.totalRecordCount;
	
	this.id;
	this.heading = "Selections:"
	this.lostfocus;
	this.lastItemIndex;
	this.lastItemPosition;
};

LiveTvItems.prototype.close = function() {
	dom.remove("playerBackdrop")
	dom.off("#view", "scroll", this.scroll);
	dom.off("body","keydown", this.lostfocus);
}
LiveTvItems.prototype.load = function(settings,backstate) {
	settings = settings || {};
	
	var self = this;
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
	
	this.id = guid.create();
	var token = guid.create();	
	var node;

	
	
	dom.hide("#server");
	dom.hide("#user");
	dom.show("#details")
	dom.show("#homeLink");

	self.close()
	
	dom.css("#poster", {
		backgroundImage: "url(./images/generic-backdrop.png)"
	});
	
	dom.html("#view", {
		nodeName: "div",
		className: "collection-view",
		id: "collection"
	});	

	this.lostfocus = dom.on("body", "keydown", lostFocus);
			
	//collection handlers
	dom.delegate("#collection", "a.latest-item", "click", function(event) {
		event.stopPropagation()
		event.preventDefault()
		self.lastItemIndex = event.delegateTarget.dataset.index;
		self.lastItemPosition = document.getElementById("view").scrollLeft;
		dom.dispatchCustonEvent(document, "mediaItemSelected", event.delegateTarget.dataset);
	});	

	dom.delegate("#collection", "a", "keydown", navigation);
	
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
    if (settings.activeButton == 1)
  	   emby.getLiveTvPrograms({
  		   HasAired: 'false',
  		   MaxStartDate: now,
  		   success: displayUserItems,
  		   error: error				
  	   });
     else
     if (settings.activeButton == 2)
 	   emby.getLiveTvPrograms({
 		   HasAired: 'false',
 		   MinStartDate: now,
 		   MaxStartDate: today,
 		   success: displayUserItems,
 		   error: error				
 	   });
    else
    if (settings.activeButton == 3)
   	   emby.getLiveTvPrograms({
   		   HasAired: 'false',
   		   MinStartDate: now,
   		   MaxStartDate: prefsDays,
   		   isSeries: true,
   		   success: displayUserItems,
   		   error: error				
   	   });
    else
    if (settings.activeButton == 4)
   	   emby.getLiveTvPrograms({
   		   HasAired: 'false',
   		   isMovie: true,
   		   success: displayUserItems,
   		   error: error				
   	   });
	

    function setSeriesTimer(idx){
		var found = false;
    	self.timerdata.Items.forEach (function(item){
    		if ((item.ChannelId == self.data.Items[idx].ChannelId || item.RecordAnyChannel == true ) && item.Id == self.data.Items[idx].SeriesTimerId)
    			found = true
    	})
		if (!found)
			delete self.data.Items[idx].SeriesTimerId
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
 		   success: getChannels,
   		   error: error				
   	   });
    }
    function getChannels(timerdata){
    	self.timerdata = timerdata;
    	emby.getLiveTvChannels({
    		success: processUserItems,
    		error: error
    	});
    }
    function processUserItems(channeldata){
       self.channeldata = channeldata
	   // get shows and remove duplicates.
	   var now = new Date().toISOString()
	   var newdata = {
		   Items:[],
		   TotalRecordCount:0
	   }
    	
	   // set Series timers
	   for (var i = 0; i < self.data.Items.length ; i++)
	      if (typeof (self.data.Items[i].SeriesTimerId != 'undefined'))
	    	  setSeriesTimer(i);

       // binary search for start position
	   var a = 0
	   var x = 0
	   var z = self.data.Items.length
	   var name
	   
	   for (x=Math.floor((a+z)/2); (z-a) > 10;x=Math.floor((a+z)/2)){
		   if (self.data.Items[x].SortName.charAt(0).toUpperCase() >= settings.sortName.charAt(0))
		      z = x
		   else
		      a = x	  
	   }
       // load data 	   
       for (x = a; x < self.data.Items.length;x++){
	      if (self.data.Items[x].Name == settings.name){
		      newdata.Items[newdata.Items.length]= self.data.Items[x]
	          if (self.data.Items[x].SortName.charAt(0).toUpperCase() > settings.sortName.charAt(0))
	        	  break;
	      }
       }
	   // add channel data
       var found = 0
       for (x = 0;x<newdata.Items.length;x++)
    	     for(var y=0;y<self.channeldata.Items.length;y++)
    	    	 if(newdata.Items[x].ChannelId == self.channeldata.Items[y].Id){
    	    		 found++
    	    		 newdata.Items[x]['ChannelNumber'] = self.channeldata.Items[y].Number;
    	    		 newdata.Items[x]['ChannelName'] = self.channeldata.Items[y].Name
    	    	 }

       newdata.TotalRecordCount = newdata.Items.length;
	   var length = newdata.Items.length;
	   var temp;
		
		var id = guid.create();	
									
		if (newdata.Items.length > 0) {					
			renderer.userAllTvItemsTabular(newdata, {
				container: "#collection",
				id: id,
				heading: self.heading,
				headerLink: "#homeLink a",
				initialise: true
			});
		}	
			
		if (backstate == false || self.lastItemIndex == null)
            focus(".latest-item");
		else
			restoreCollectionFocus();
	}

	function restoreCollectionFocus(){
		var elmnts = dom.querySelectorAll(".latest-item")
		for(var idx = 0;idx<elmnts.length;idx++)
			if (elmnts[idx].dataset.index == self.lastItemIndex)
			{	
				dom.focus(elmnts[idx]);
				break;
			}
		document.getElementById("view").scrollLeft = self.lastItemPosition;
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
				
		if (dom.hasClass(self, "user-views-item")) {	
			switch (event.which) {
				case keys.KEY_LEFT: 
					focus(dom.data(self, "keyLeft"));
					break;
				case keys.KEY_UP: 
					focus(dom.data(self, "keyUp"));
					break;
				case keys.KEY_RIGHT: 
					focus(".column-0 a");
					break;
				case keys.KEY_DOWN: 
					focus(dom.data(self, "keyDown") == '%index%' ? dom.data(self, "keyUp") : dom.data(self, "keyDown"));
					break;											
			}
		}
		
		if (dom.hasClass(self, "latest-item")) {	
			var columnSetIndex = this.parentNode.parentNode.id ? parseInt(self.parentNode.parentNode.id.substr(self.parentNode.parentNode.id.lastIndexOf("_") + 1)) : 0;
			var lastColumn = columnSetIndex > 0 ? dom.data("#latestItemSet_" + (columnSetIndex - 1), "lastColumn") : "";

			switch (event.which) {
				case keys.KEY_LEFT: 
					focus(dom.data(self, "keyLeft").replace("%previous%", ".activeButton"));
					break;
				case keys.KEY_UP: 
					vfocus(dom.data(self, "keyUp"));
					break;
				case keys.KEY_RIGHT: 
					focus(dom.data(self, "keyRight").replace("%next%", "#latestItemSet_" + (columnSetIndex + 1) +  " .latest-items-column a"));
					break;
				case keys.KEY_DOWN: 
					vfocus(dom.data(self, "keyDown") == '%index%' ? dom.data(self, "keyUp") : dom.data(self, "keyDown"));
					break;																	
			}
		}		
	}
    function vfocus(query){
		var node = dom.querySelector(query);
		if (node){
		   var view = dom.querySelector("#view");
		   var rect = node.getBoundingClientRect();
		   if (rect.top < 150)
		   {	
		  	   view.scrollTop-= (150 - rect.top) -5;
		   }
		   else
		   if (rect.bottom > window.innerHeight)
		   {
		      	view.scrollTop += (rect.bottom - window.innerHeight + 5);
		   }
		   node.focus();
		   if (node.classList.contains("latest-item") || node.classList.contains("user-views-item")) {
			   dom.data("#view", "lastFocus", "#" + node.id);
		   }
		}
    }
	function focus(query) {
		node = dom.focus(query);
		if (node && node.id) {
			if (node.classList.contains("latest-item") || node.classList.contains("user-views-item")) {
				dom.data("#view", "lastFocus", "#" + node.id);
			}
			if (dom.hasClass(node, "latest-item")) {
				self.node = node
			   	emby.getLiveTvChannel({
			   	   id: dom.data(node,"channelid"),
			   	   success: updateDetails,
			   	   error: error				
			    });

			   	var index = dom.data(node.parentNode, "index");
			} else {
				dom.empty("#details");
			}			
		}
	}

	function updateDetails(data){
		return
		var year = dom.data(self.node, "year") || "";
		var runtime = Number(dom.data(self.node, "runtime")) || 0;
		var startdate = dom.data(self.node, "startdate") || "";
		var hours = (runtime >= 60 ? Math.floor(runtime/60) + " hr " : "");
		var mins = (runtime % 60 > 0 ? runtime % 60 + " min" : "");
		dom.html("#details", {
			nodeName: "div",
			childNodes: [{
				nodeName: "div",
				className: "title",
				text: dom.data(self.node, "episode") ? dom.data(self.node, "episode").split(';')[0] : dom.data(self.node,"name")
			}, {
				nodeName: "div",
				className: "subtitle",
				text: year + (runtime ? " / " + hours + mins : "") + (startdate ? " / " + formatDate(startdate) : "") + ' / '+data.Name + ' ('+data.Number+')'			
			}]
		});
		
	}
	function error(data) {
		complete();
		message.show({
			messageType: message.error,			
			text: "Loading user livetv summary failed!"
		});			
	}			
};