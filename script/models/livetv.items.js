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
	this.dataLoaded;
	this.data = {};
	this.timerdata = {};
	this.itemtimerdata = {};
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
	dom.empty("#details")
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

	   var newdata = {
			   Items:[],
			   TotalRecordCount:0
		   }

	
	
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

/*	
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
   		   getOverviews: true,
  		   error: error				
  	   });
     else
     if (settings.activeButton == 2)
 	   emby.getLiveTvPrograms({
 		   HasAired: 'false',
 		   MinStartDate: now,
 		   MaxStartDate: today,
   		   getOverviews: true,
 		   success: displayUserItems,
 		   error: error				
 	   });
    else
    if (settings.activeButton == 3)
    	if (self.dataLoaded)
    		displayUserItems(self.data)
        else{
		    self.dataLoaded = true;
      	    emby.getLiveTvPrograms({
   	  	       HasAired: 'false',
   		       MinStartDate: now,
   		       MaxStartDate: prefsDays,
   		       isSeries: true,
   		       getOverviews: true,
   		       success: displayUserItems,
   		       error: error
   	       });
        }
    else
    if (settings.activeButton == 4)
   	   emby.getLiveTvPrograms({
   		   HasAired: 'false',
   		   isMovie: true,
   		   getOverviews: true,
   		   success: displayUserItems,
   		   error: error				
   	   });
*/
	displayUserItems(prefs.data)

    function setTimers(idx){
	    if (typeof newdata.Items[idx].SeriesTimerId != 'undefined'){
	    	setSeriesTimer(idx);
		}
		checkForSeriesTimer(idx)
	    if (typeof newdata.Items[idx].TimerId != 'undefined'){
	    	setItemTimer(idx);
		}
	    checkForItemTimer(idx)
    }
    function checkForSeriesTimer(idx){
    	self.timerdata.Items.forEach (function(item){
    		if ((item.Status == "New" || item.Status == 'InProgress') && item.ChannelId == newdata.Items[idx].ChannelId && item.ProgramId == newdata.Items[idx].Id){
    			if (typeof item.SeriesTimerId != 'undefined')
    			    newdata.Items[idx]['SeriesTimerId'] = item.SeriesTimerId
    		}
    	})
    }	
    function checkForItemTimer(idx){
    	self.timerdata.Items.forEach (function(item){
    		if ((item.Status == "New" || item.Status == 'InProgress') && item.ChannelId == newdata.Items[idx].ChannelId && item.ProgramId == newdata.Items[idx].Id)
    			newdata.Items[idx]['TimerId'] = item.Id
    	})
    }	
	
	function setItemTimer(idx){
		var found = false;
    	self.timerdata.Items.forEach (function(item){
    		if (item.ChannelId == newdata.Items[idx].ChannelId && item.Id == newdata.Items[idx].TimerId && (item.Status == "New" || item.Status == 'InProgress'))
    			found = true
    	})
		if (!found)
			delete newdata.Items[idx].TimerId
    }
	
	function setSeriesTimer(idx){
		var found = false;
    	self.timerdata.Items.forEach (function(item){
    		if (item.ChannelId == newdata.Items[idx].ChannelId && item.Id == newdata.Items[idx].TimerId && (item.Status == "New" || item.Status == 'InProgress'))
    			if (typeof item.SeriesTimerId != 'undefined')
    			   found = true
    	})
		if (!found)
			delete newdata.Items[idx].SeriesTimerId
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
   	   emby.getLiveTvTimers({
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
       newdata.Items = []

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
       
       // set timers
       for (var i = 0; i < newdata.Items.length ; i++){
	    	setTimers(i)
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
            vfocus(".latest-item");
		else
			restoreCollectionFocus();
	}

	function restoreCollectionFocus(){
		var elmnts = dom.querySelectorAll(".latest-item")
		for(var idx = 0;idx<elmnts.length;idx++)
			if (elmnts[idx].dataset.index == self.lastItemIndex)
			{	
				vfocus(elmnts[idx]);
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
		   if (node.classList.contains("latest-item")) {
			    emby.getUserItem({
			 	   id: dom.data(node,"id"),
			 	   success: updateDetails,
			 	   error: error					
			 	})	
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
		}
	}

	function updateDetails(item){
		var now = new Date().toISOString();
		if (item){
			var year = item.ProductionYear;
			var runtime = Math.round(item.RunTimeTicks/(60*10000000));
			var startdate = item.StartDate;
			var hours = (runtime >= 60 ? Math.floor(runtime/60) + " hr " : "");
			var mins = (runtime % 60 > 0 ? runtime % 60 + " min" : "");
			var itemStartDate = new Date(item.StartDate)
			var end = Math.abs(new Date(item.EndDate) - itemStartDate)
			var start = Math.abs(new Date() - itemStartDate)
 		    node = document.getElementsByClassName("overview")[0];
		    item.Overview ? node.textContent = item.Overview : node.textContent = ''
 		    node = document.getElementsByClassName("dtitle")[0];
		    node.textContent = item.EpisodeTitle? item.EpisodeTitle.split(';')[0]: item.Name
 		    node = document.getElementsByClassName("year")[0];
		    node.textContent = item.ProductionYear
 		    node = document.getElementsByClassName("rating")[0];
		    item.OfficialRating ? node.textContent = item.OfficialRating : node.textContent = "U"
 		    node = document.getElementsByClassName("runtime")[0];
		    node.textContent = hours || mins ? hours + mins : ""
		    if (item.StartDate && item.StartDate > now){
 		        node = document.getElementsByClassName("airs")[0];
		        node.textContent = "Airs "+formatDate(item.StartDate)+" on "+item.ChannelName+ " ("+item.ChannelNumber+")"
		    }
		    else
		    if (item.StartDate && item.StartDate <= now && item.EndDate >= now){
 		        node = document.getElementsByClassName("airs")[0];
		        node.textContent = "Now Playing on "+item.ChannelName+ " ("+item.ChannelNumber+")"
		    }
		    else
		    if (item.EndDate && item.EndDate < now){
 		        node = document.getElementsByClassName("airs")[0];
		        node.textContent = "Series Airs on "+item.ChannelName+ " ("+item.ChannelNumber+")"
		    }
 		    node = document.getElementsByClassName("genre")[0];
		    node.textContent = item.Genres.join(" / ")
		}
	}
	function error(data) {
		complete();
		message.show({
			messageType: message.error,			
			text: "Loading user livetv summary failed!"
		});			
	}			
};