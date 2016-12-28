// Author: Kevin Wilcox
// Modifed: 07/20/2016
// The Paradigm Grid
// --------------------------------------------

var prefs = new Prefs();

function Prefs() {
	this.settingsSubmit;
	this.userViewsItemSettings;
	this.navigation;
	this.doViewItem_1_0_click;	
	this.doViewItem_1_1_click;	
	this.doViewItem_1_2_click;	
	this.doViewItem_1_3_click;	
	this.doViewItem_1_4_click;
	this.doViewItem_1_5_click;
	this.doViewItem_2_0_click;	
	this.doViewItem_2_1_click;	
	this.doViewItem_2_2_click;	
	this.doViewItem_2_3_click;
	this.doViewItem_2_4_click;
	this.settings = "emby.settings.prefs";
	this.backSkip = 15;
	this.fwdSkip = 30;
	this.directPlay = false;
	this.autoLogin = true;
	this.redButton = 1;
	this.greenButton = 2;
	this.yellowButton = 0;
	this.blueButton = 0;
	this.videoBitrate = 100000000;
	this.audioBitrate = 128000;
	this.resumeTicks = 0;
	this.continueWatchingDays = 2;
	this.prefsVersion = 4;
	this.interval;
	this.restartInterval;
	this.skipTime = 0;
	this.currentTime = 0;
	this.firstSkip = true;
	this.playerRestarting = false;
	this.mimeType = "";
	this.videoDuration;
	this.video3DFormat;
	this.subtitleAvailable;
};


Prefs.prototype.load = function() {
	var self = this;
	var prefs = new Array;
	if (storage.exists(this.settings)) 
	{
		prefs = (storage.get(this.settings));
		this.fwdSkip = prefs[0];
		this.backSkip = prefs[1];
		this.videoBitrate = prefs[2];
		this.audioBitrate = prefs[3];
		this.redButton = prefs[4];
		this.greenButton = prefs[5];
		this.yellowButton = prefs[6];
		this.blueButton = prefs[7];
		this.prefsVersion = prefs[8];
		this.directPlay = prefs[9];
		this.autoLogin = prefs[10];
		if (this.prefsVersion != 4)
		{
			playerpopup.show({
				duration: 4000,
				text: "Settings reset due to database update: Please check your settings."
			});	
			self.reset()
			self.save()
		}	
	} 
};

Prefs.prototype.save = function(){
	var self = this;
	var prefs = new Array;
	
	prefs.push(this.fwdSkip,this.backSkip, this.videoBitrate, this.audioBitrate, this.redButton, this.greenButton, this.yellowButton, this.blueButton, this.prefsVersion, this.directPlay, this.autoLogin);
	storage.set(self.settings,prefs);
};

Prefs.prototype.reset = function(){
	storage.remove(this.settings);
	this.backSkip = 15;
	this.fwdSkip = 30;
	this.directPlay = false;
	this.autoLogin = true;
	this.videoBitrate = 100000000;
	this.audioBitrate = 128000;
	this.redButton = 1;
	this.greenButton = 2;
	this.yellowButton = 0;
	this.blueButton = 0;
	this.prefsVersion = 4;
}

Prefs.prototype.clientSettingsClose = function(){
	dom.off("body","keydown", this.navigation);
	dom.off(".settings-submit", "click", this.settingsSubmit);
	dom.off(".user-views-item-settings", "click", this.userViewsItemSettings)
	dom.off("#viewItem_1_0", "click", this.doViewItem_1_0_click);
	dom.off("#viewItem_1_1", "click", this.doViewItem_1_1_click);
	dom.off("#viewItem_1_2", "click", this.doViewItem_1_2_click);
	dom.off("#viewItem_1_3", "click", this.doViewItem_1_3_click);
	dom.off("#viewItem_1_4", "click", this.doViewItem_1_4_click);
	dom.off("#viewItem_1_5", "click", this.doViewItem_1_5_click);
	dom.off("#viewItem_2_0", "click", this.doViewItem_2_0_click);
	dom.off("#viewItem_2_1", "click", this.doViewItem_2_1_click);
	dom.off("#viewItem_2_2", "click", this.doViewItem_2_2_click);
	dom.off("#viewItem_2_3", "click", this.doViewItem_2_3_click);
	dom.off("#viewItem_2_4", "click", this.doViewItem_2_4_click);
	dom.remove("#screenplaySettings")
}
Prefs.prototype.clientSettings = function(){
	var self = this;

	this.backdrops = new Array();
	this.total = 0;
	this.count = 0;

	dom.hide("#server");
	dom.hide("#user");
	dom.show("#homeLink");
	self.clientSettingsClose()


	this.navigation = dom.on("body","keydown",navigation)

	dom.html("#view", {
		nodeName: "div",
		className: "home-view",
		id: "home2",
		childNodes: [{
			nodeName: "div",
			className: "user-views-column",
			id: "userViews_0"
		}]
	});

	
	var limit = 5;
	var rowCount = 4;
	var columnCount = 2;		
	var currentColumn = 0;
	var currentRow = 0;
	var column = 0;
	var row = 0;
	var currentHighlight = "";
	var settingsItemfocus = false;
	var listboxItemfocus = false
	var homeFocus = false;
	var updateFocus = false;
	dom.append("#userViews", {
		nodeName: "div",
		className: "user-views-column",
		id: "userViews_" + currentColumn
	});
		
	dom.append("#userViews_" + currentColumn, {
		nodeName: "a",
		href: "#",
		className: "user-views-item-settings",
		id: "viewItem_" + currentColumn + "_" + row,
		childNodes: [{
			nodeName: "span",
			className: "user-views-item-name",	
			text: "Settings"				
		}]
	});		

	dom.append("body", {
		nodeName: "div",
		id: "screenplaySettings",
		childNodes: [{
			nodeName: "div",
			className: "screenplayCol1",
			id: "screenplaySettings1"
		}, {
			nodeName: "div",
			className: "screenplayCol2",
			id: "screenplaySettings2"
		}, {
			nodeName: "div",
			className: "screenplayUpdateButton",
			id: "screenplaySettings3"
		}]		
	});

	    // Create Column 1 Settings
	
		var body = document.getElementById("screenplaySettings1");
	    var tbl  = document.createElement('table');
	    tbl.style.borderSpacing = '10px';
	    var caption = tbl.createCaption();
	    var tr, td;
	    caption.style.fontSize = '40px';
	    caption.style.textAlign = 'left';
	    caption.innerHTML = "<b>Playback Settings</b>";
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.appendChild(document.createTextNode('Forward Skip:'));
	    td = tr.insertCell(-1);
	    td.innerHTML = '<input style="font-size:30px; text-align:right; padding:0px 10px 0px 0px" id ="viewItem_1_0" class="viewItem"  size="2" type="text" name="fwdskip" value="'+ self.fwdSkip + '"/>';
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.appendChild(document.createTextNode('Back Skip:'));
	    td = tr.insertCell(-1);
	    td.innerHTML = '<input style="font-size:30px; text-align:right; padding:0px 10px 0px 0px" id ="viewItem_1_1" class="viewItem" size="2" type="text" name="backskip" value="'+ self.backSkip + '"/>';
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    body.appendChild(tbl);
	    
	    tbl  = document.createElement('table');
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    body.appendChild(tbl);

	    
	    tbl  = document.createElement('table');
	    caption = tbl.createCaption();
	    caption.style.fontSize = '40px';
	    caption.style.textAlign = 'left';
	    caption.innerHTML = "<b>Server Settings</b>";
	    tbl.style.borderSpacing = '10px';
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.appendChild(document.createTextNode('Video BitRate:'));
	    td = tr.insertCell(-1);
	    td.innerHTML = '<input style="font-size:30px; text-align:right; padding:0px 10px 0px 0px" id ="viewItem_1_2" class="viewItem" size="5" type="text" name="videorate" value="'+ self.videoBitrate + '"/>';
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.appendChild(document.createTextNode('Audio BitRate:'));
	    td = tr.insertCell(-1);
	    td.innerHTML = '<input style="font-size:30px; text-align:right; padding:0px 10px 0px 0px" id ="viewItem_1_3" class="viewItem" size="4" type="text" name="audiorate" value="'+ self.audioBitrate + '"/>';
	    td = tr.insertCell(-1);
        td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.appendChild(document.createTextNode('Direct Play:'));
	    td = tr.insertCell(-1);
	    td.innerHTML = '<input style="font-size:30px; text-align:right; padding:0px 10px 0px 0px" id ="viewItem_1_4" class="viewItem" size=1 type="text" name="directPlay"/>';
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    body.appendChild(tbl);

	    tbl  = document.createElement('table');
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    body.appendChild(tbl);

		body = document.getElementById("screenplaySettings3");
	    tbl  = document.createElement('table');
	    tbl  = document.createElement('table');
	    tbl.style.borderSpacing = '0px';
	    tbl.style.padding = '25px';
	    tr = tbl.insertRow();
	    td = tr.insertCell();
	    td.innerHTML = '<button id ="viewItem_1_5" class="settings-submit">Update</button>';
	    body.appendChild(tbl);
	    
	    // Create Column 2 Settings
		
		body = document.getElementById("screenplaySettings2");
	    tbl  = document.createElement('table');
	    tbl.style.borderSpacing = '10px';
	    caption = tbl.createCaption();
	    caption.style.fontSize = '40px';
	    caption.style.textAlign = 'left';
	    caption.innerHTML = "<b>Remote Control Settings</b>";
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.appendChild(document.createTextNode('Red Button:'));
	    td = tr.insertCell(-1);
	    td.innerHTML = '<select style="font-size:30px; text-align:right; padding:0px 10px 0px 0px" class="viewItem" id="viewItem_2_0" name="redButton"><option>Not Used</option><option>Reset screenplay</option><option>Toggle Controls</option><option>Toggle Subtitles</option></select>';
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.appendChild(document.createTextNode('Green Button:'));
	    td = tr.insertCell(-1);
	    td.innerHTML = '<select style="font-size:30px; text-align:right; padding:0px 10px 0px 0px" class="viewItem" id ="viewItem_2_1" name="greenButton"><option>Not Used</option><option>Reset screenplay</option><option>Toggle Controls</option><option>Toggle Subtitles</option></select>';
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.appendChild(document.createTextNode('Yellow Button:'));
	    td = tr.insertCell(-1);
	    td.innerHTML = '<select style="font-size:30px; text-align:right; padding:0px 10px 0px 0px" class="viewItem" id ="viewItem_2_2" name="yellowButton"><option>Not Used</option><option>Reset screenplay</option><option>Toggle Controls</option><option>Toggle Subtitles</option></select>';
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.appendChild(document.createTextNode('Blue Button:'));
	    td = tr.insertCell(-1);
	    td.innerHTML = '<select style="font-size:30px; text-align:right; padding:0px 10px 0px 0px" class="viewItem" id ="viewItem_2_3" name="blueButton"><option>Not Used</option><option>Reset screenplay</option><option>Toggle Controls</option><option>Toggle Subtitles</option></select>';
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    body.appendChild(tbl);
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    body.appendChild(tbl);
	    
	    tbl  = document.createElement('table');
	    tbl.style.borderSpacing = '10px';
	    caption = tbl.createCaption();
	    caption.style.fontSize = '40px';
	    caption.style.textAlign = 'left';
	    caption.innerHTML = "<b>Client Settings</b>";
	    tbl.style.borderSpacing = '10px';
	    tr = tbl.insertRow(-1);
	    td = tr.insertCell(-1);
	    td.appendChild(document.createTextNode('Auto LogIn:'));
	    td = tr.insertCell(-1);
	    td.innerHTML = '<input style="font-size:30px; text-align:right; padding:0px 10px 0px 0px" id ="viewItem_2_4" class="viewItem" size=1 type="text" name="autoLogin"/>';
	    td = tr.insertCell(-1);
	    td.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	    body.appendChild(tbl);
	    
	    
    
	    if (this.directPlay)
	        dom.querySelector("#viewItem_1_4").value = 'On'
	    else    	
	        dom.querySelector("#viewItem_1_4").value = 'Off'
	        	
	    dom.querySelector("#viewItem_2_0").selectedIndex = this.redButton;
	    dom.querySelector("#viewItem_2_1").selectedIndex = this.greenButton
	    dom.querySelector("#viewItem_2_2").selectedIndex = this.yellowButton
	    dom.querySelector("#viewItem_2_3").selectedIndex = this.blueButton
	    
	    if (this.autoLogin)
	        dom.querySelector("#viewItem_2_4").value = 'On'
	    else    	
	        dom.querySelector("#viewItem_2_4").value = 'Off'
	        	
	    this.settingsSubmit = dom.on(".settings-submit", "click", settingsSubmit);
		this.userViewsItemSettings = dom.on(".user-views-item-settings", "click", userViewsItemSettings)
		this.doViewItem_1_0_click = dom.on("#viewItem_1_0", "click", doViewItem_1_0_click)
		this.doViewItem_1_1_click = dom.on("#viewItem_1_1", "click", doViewItem_1_1_click)
		this.doViewItem_1_2_click = dom.on("#viewItem_1_2", "click", doViewItem_1_2_click)
		this.doViewItem_1_3_click = dom.on("#viewItem_1_3", "click", doViewItem_1_3_click)
		this.doViewItem_1_4_click = dom.on("#viewItem_1_4", "click", doViewItem_1_4_click)
		this.doViewItem_1_5_click = dom.on("#viewItem_1_5", "click", doViewItem_1_5_click)
		this.doViewItem_2_0_click = dom.on("#viewItem_2_0", "click", doViewItem_2_0_click)
		this.doViewItem_2_1_click = dom.on("#viewItem_2_1", "click", doViewItem_2_1_click)
		this.doViewItem_2_2_click = dom.on("#viewItem_2_2", "click", doViewItem_2_2_click)
		this.doViewItem_2_3_click = dom.on("#viewItem_2_3", "click", doViewItem_2_3_click)
		this.doViewItem_2_4_click = dom.on("#viewItem_2_4", "click", doViewItem_2_4_click)
		dom.focus("#viewItem_0_0");

	function userViewsItemSettings (event){
		event.preventDefault();
		event.stopPropagation();
		dom.dispatchCustonEvent(document, "userPrefsSelected", this.dataset);
	}

	function settingsSubmit (event){
		self.fwdSkip = dom.querySelector("#viewItem_1_0").value;
		self.backSkip = dom.querySelector("#viewItem_1_1").value;
		self.videoBitrate = dom.querySelector("#viewItem_1_2").value;
		self.audioBitrate = dom.querySelector("#viewItem_1_3").value;
		var str = dom.querySelector("#viewItem_1_4").value;
		str = str.replace(/\s+/g,'')
		if (str == 'On')
			self.directPlay = true;
		else
			self.directPlay = false;
		self.redButton = dom.querySelector("#viewItem_2_0").selectedIndex;
		self.greenButton = dom.querySelector("#viewItem_2_1").selectedIndex;
		self.yellowButton = dom.querySelector("#viewItem_2_2").selectedIndex;
		self.blueButton = dom.querySelector("#viewItem_2_3").selectedIndex;
		var str = dom.querySelector("#viewItem_2_4").value;
		str = str.replace(/\s+/g,'')
		if (str == 'On')
			self.autoLogin = true;
		else
			self.autoLogin = false;
		playerpopup.show({
			duration: 1000,
			text: "Settings changed" 
		});	
		self.save();
		dom.querySelector("#viewItem_1_5").focus();
		currentColumn = 1;
		currentRow = 4;
	}
	function doViewItem_1_0_click (event){
		currentColumn = 1
		currentRow = 0
		highlight("#viewItem_1_0")
		settingsItemfocus = true;
	}
	
	function doViewItem_1_1_click (event){
		currentColumn = 1
		currentRow = 1
		highlight("#viewItem_1_1")
		settingsItemfocus = true;
	}
	
	function doViewItem_1_2_click (event){
		currentColumn = 1
		currentRow = 2
		highlight("#viewItem_1_2")
		settingsItemfocus = true;
	}
	
	function doViewItem_1_3_click (event){
		currentColumn = 1
		currentRow = 3
		highlight("#viewItem_1_3")
		settingsItemfocus = true;
	}
	
	function doViewItem_1_4_click (event){
		var node = dom.querySelector("#viewItem_1_4")
		node.blur()
		currentColumn = 1
		currentRow = 4
		highlight("#viewItem_1_4")
		settingsItemfocus = true;
		var str = node.value;
		str = str.replace(/\s+/g,'')
		if (str == "On")
			node.value = "Off"
		else
			node.value = "On"
    }
	
	function doViewItem_1_5_click (event){
		currentColumn = 1
		currentRow = 5
		highlight("#viewItem_1_5")
	}
	
	function doViewItem_2_0_click (event){
		currentColumn = 2
		currentRow = 0
		highlight("#viewItem_2_0")
		dom.removeClass("#viewItem_2_0","viewItem");
		dom.addClass("#viewItem_2_0","viewItem_Selected");
		listboxItemfocus = true;
		settingsItemfocus = true;
	}
	
	function doViewItem_2_1_click (event){
		currentColumn = 2
		currentRow = 1
		highlight("#viewItem_2_1")
		dom.removeClass("#viewItem_2_1","viewItem");
		dom.addClass("#viewItem_2_1","viewItem_Selected");
		listboxItemfocus = true;
		settingsItemfocus = true;
	}
	
	function doViewItem_2_2_click (event){
		currentColumn = 2
		currentRow = 2
		highlight("#viewItem_2_2")
		dom.removeClass("#viewItem_2_2","viewItem");
		dom.addClass("#viewItem_2_2","viewItem_Selected");
		listboxItemfocus = true;
		settingsItemfocus = true;
	}
	
	function doViewItem_2_3_click (event){
		currentColumn = 2
		currentRow = 3
		highlight("#viewItem_2_3")
		dom.removeClass("#viewItem_2_3","viewItem");
		dom.addClass("#viewItem_2_3","viewItem_Selected");
		listboxItemfocus = true;
		settingsItemfocus = true;
	}
	
	function doViewItem_2_4_click (event){
		var node = dom.querySelector("#viewItem_2_4")
		node.blur()
		currentColumn = 1
		currentRow = 4
		highlight("#viewItem_2_4")
		settingsItemfocus = true;
		var str = node.value;
		str = str.replace(/\s+/g,'')
		if (str == "On")
			node.value = "Off"
		else
			node.value = "On"
    }
function navigation(event) {
		
	    if (event.which == keys.KEY_OK)
	    {
	    	if (currentHighlight == ".home-link")
	    	{	
	            event.stopPropagation()
                event.preventDefault()
	    	}
	        focusHandler();
	        return
	    }    
	    if (listboxItemfocus)
	    	return

/*	    	playerpopup.show({
	    		duration: 1000,
	    		text: event.which
	    	});*/	
	    switch (event.which) {
			case keys.KEY_LEFT: 
			    currentRow = 0;
				if (currentColumn ==  0)
					currentColumn = columnCount;
				else
					currentColumn--;
				break;
			case keys.KEY_UP: 
			    if (currentRow < 1)
			    {	
				    homeFocus = true;
				    currentRow = -1
			    }
			    else
				    currentRow--;
			    break;
			case keys.KEY_RIGHT:
				currentRow = 0;
				if (currentColumn ==  columnCount)
					currentColumn = 0;
				else
					currentColumn++;
				break;
			case keys.KEY_DOWN: 
				if (currentColumn > 0)
					if (currentRow >= rowCount)
					{	
					    updateFocus = true;
					    currentRow = rowCount +1;
					}
				    else
					    currentRow++;
				else
					currentRow = 0;
				break;		
			default:
			    if (currentHighlight == "#viewItem_1_4")
			    {
					var node = dom.querySelector("#viewItem_1_4")
					var str = node.value;
					str = str.replace(/\s+/g,'')
					if (str == 'On')
						node.value = "Off"
					else
						node.value = "On"
			    }
			    if (currentHighlight == "#viewItem_2_4")
		        {
			 	    var node = dom.querySelector("#viewItem_2_4")
  				    var str = node.value;
				    str = str.replace(/\s+/g,'')
				    if (str == 'On')
				 	    node.value = "Off"
				    else
					    node.value = "On"
		        }
				return;
		}
		highlight("#viewItem_"+currentColumn+"_"+currentRow)
	}
	function highlight(query){
		settingsItemfocus = false;
		for(var col = 0;col <= columnCount; col++)
			for (var row = 0; row <= rowCount+1; row++)
			{	
				if (dom.hasClass("#viewItem_"+ col + "_" +row, "viewItem_highlight"))
					dom.removeClass("#viewItem_"+ col + "_" +row, "viewItem_highlight");
				if (dom.hasClass("#viewItem_"+ col + "_" +row, "viewItem_Selected"))
					dom.removeClass("#viewItem_"+ col + "_" +row, "viewItem_Selected");
				if ((col > 0) && !(col == 1 && row == 4))
					if (!dom.hasClass("#viewItem_"+ col + "_" +row, "viewItem"))
				        dom.addClass("#viewItem_"+ col + "_" +row, "viewItem")
			}

		if (homeFocus)
		{	
			dom.querySelector(".home-link").focus()
			currentHighlight = ".home-link"
			homeFocus = false;
			return;
	    }
		if (updateFocus)
		{
			dom.querySelector("#viewItem_1_5").focus()
			currentHighlight = "#viewItem_1_5"
			dom.addClass("#viewItem_1_5","viewItem_highlight");
			updateFocus = false;
			return;
		}

		if (query == "#viewItem_0_0")
			dom.querySelector("#viewItem_0_0").focus();
		else
			dom.querySelector("#viewItem_0_0").blur();

		if (query == "#viewItem_1_5")
			dom.querySelector("#viewItem_1_5").focus();
		else
			dom.querySelector("#viewItem_1_5").blur();
		
		dom.addClass(query,"viewItem_highlight");
		currentHighlight = query;
	}

	function focusHandler(){
		if (currentHighlight == "#viewItem_1_4" || currentHighlight == "#viewItem_1_5" || currentHighlight == "#viewItem_2_4" || currentHighlight == "#viewItem_0_0" || currentHighlight == ".home-link")
		{
			dom.querySelector(currentHighlight).click();
			return;
		}
		if (currentColumn == 1)
		{
 		    if (!settingsItemfocus)
		    {
			    settingsItemfocus = true;
			    dom.querySelector(currentHighlight).select();
			    dom.querySelector(currentHighlight).focus();
				dom.removeClass(currentHighlight,"viewItem");
				dom.addClass(currentHighlight,"viewItem_Selected");
		    }
		    else
		    {
			    settingsItemfocus = false;
				dom.removeClass(currentHighlight,"viewItem_Selected");
				dom.addClass(currentHighlight,"viewItem");
			    dom.querySelector(currentHighlight).blur();
		    }
 		    return
		}
		if (currentColumn == 2)
		{
			if (!settingsItemfocus)
			{
				settingsItemfocus = true;
				listboxItemfocus = true;
				dom.removeClass(currentHighlight,"viewItem");
				dom.addClass(currentHighlight,"viewItem_Selected");
				dom.querySelector(currentHighlight).focus();
			}
			else
			{
				settingsItemfocus = false;
				listboxItemfocus = false;
				dom.removeClass(currentHighlight,"viewItem_Selected");
				dom.addClass(currentHighlight,"viewItem");
				dom.querySelector(currentHighlight).blur();
			}
			return
		}
	}
	
};

