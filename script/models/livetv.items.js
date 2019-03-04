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
	this.data = {};
	this.timerdata = {};
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
		id: "collection",
		childNodes: [{
			nodeName: "div",
			className: "user-views-column",
			id: "userViews_0"
		}]
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
	var nextWeek = new Date()
	tomorrow.setHours(24,0,0,0);
	nextWeek.setHours((24*2),0,0,0)
    today.setTime(today.getTime() + 60*60*1000)
    today = today.toISOString()
	tomorrow = tomorrow.toISOString();
	nextWeek = nextWeek.toISOString();
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
   		   MaxStartDate: nextWeek,
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
 		   success: processUserItems,
   		   error: error				
   	   });
    }
    function processUserItems(timerdata){
    	self.timerdata = timerdata
		// get shows and remove duplicates.
		var now = new Date().toISOString()
		var newdata = {
			Items:[],
			TotalRecordCount:0
		}
        
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
	    
	   for (var x = 0; x < self.data.Items.length;x++)
	      if (self.data.Items[x].Name == settings.name)
		      newdata.Items.push(self.data.Items[x])
				  
       newdata.TotalRecordCount = newdata.Items.length;
	   var length = newdata.Items.length;
	   var temp;
		
  	
		
		var id = guid.create();	
									
		if (newdata.Items.length > 0) {					
			renderer.userAllTvItems(newdata, {
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
					focus(dom.data(self, "keyUp"));
					break;
				case keys.KEY_RIGHT: 
					focus(dom.data(self, "keyRight").replace("%next%", "#latestItemSet_" + (columnSetIndex + 1) +  " .latest-items-column a"));
					break;
				case keys.KEY_DOWN: 
					focus(dom.data(self, "keyDown") == '%index%' ? dom.data(self, "keyUp") : dom.data(self, "keyDown"));
					break;																	
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
				text: dom.data(node, "episode") ? dom.data(node, "episode").split(';')[0] : dom.data(node,"name")
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