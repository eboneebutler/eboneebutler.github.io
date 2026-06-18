/**
 * @fileOverview This file contains a component adapter for looking up previoussly entered values
 * @author <a href="mailto:adrian.meyer@unc.com">Adrian Meyer</a>
 * @version 1.0.0
 */

/**
 * Global object to hold references to all instances
 * @class Represents a ValueHistoryEntryGlobals 
 */ 
var ValueHistoryEntryGlobals = {ObjectCount:0, Objects:[], 
  getObjectNumber: function( aObject ){ 
		var objectNumber = ++this.ObjectCount;
    this.Objects[objectNumber] = aObject;
    return objectNumber;
	} 
};

/**
 * Creates a new ValueHistoryEntry adapter by passing a text input element
 * @param {Element} aInputElement A reference to an input HTML element of the type text
 * @param {String,Function} aAjaxUrl A string with the URL or a function returning a dynamic URL to the ajax
 * @class Represents a ValueHistoryEntry 
 * @constructor
 */ 
var ValueHistoryEntry = function( aInputElement, aAjaxUrl ){
	//check for passed input control
	if(!aInputElement){
		alert("ValueHistoryEntry(): Input element of type text has to be passed to the constructor.");
		return;
	}
	
	//check for passed input control type
	if(aInputElement.type != 'text'){
		alert("ValueHistoryEntry(): Input element has to be of type text.");
		return;
	}

	//checks for multiple adapters on the same input control
	if(aInputElement.ValueHistoryEntry){
		alert("ValueHistoryEntry(): Input element " + aInputElement.name + " has already a ValueHistoryEntry.");
		return;
	}

  this.ObjectNumber = ValueHistoryEntryGlobals.getObjectNumber(this);
  /**
   * Reference to original input element
   * @public
   */
	this.InputElement = aInputElement;
	this.InputElement.ValueHistoryEntry = this;
	this.InputElement.className = 'value-history-container-input';
	
  /**
   * URL used for ajax calls. This can also be a function returning a string
   * @public
   */
	this.AjaxUrl = aAjaxUrl;
		
	this.render();
	this.hookEvents();
};

ValueHistoryEntry.prototype = {
	InputElement: false,
	
  /**
	 * Render the needed HTML
   * @private
   */
	render: function (){
		
		var parentNode = this.InputElement.parentNode;
		
		//create the button to paste ICD9 content
		this.InputButton = document.createElement("input");
		this.InputButton.type= "button";
		this.InputButton.value= "Previous Values";
		this.InputButton.setAttribute("style", "vertical-align: middle");
		this.InputButton.ValueHistoryEntry= this;
		this.InputButton.style.width = '120px';
		parentNode.appendChild(this.InputButton);
		
		var lineBreak= document.createElement("br");
		parentNode.appendChild(lineBreak);
		
		this.ValuesContainer =  document.createElement("div");
		this.ValuesContainer.className = 'value-history-container';
		this.ValuesContainer.style.display = "none";			
		
		parentNode.appendChild(this.ValuesContainer);		

		this.InputElement.style.width = '276px';
		
    this.ValuesContainer.innerHTML = '<img src="images/progress-small.gif"/>loading...';
	},
	
  /**
	 * Supports ie6 - only uses attachEvent
   * @private
   */
	hookEvent: function(aElement, aListenerEventName, aAttachEventName, aEventCallback){
		if(window.addEventListener){
			aElement.addEventListener(aListenerEventName, aEventCallback, false);
		}
		else {
			aElement.attachEvent(aAttachEventName, aEventCallback);			
		}
	},

  /**
	 * Attach click events to button elements, attachEvent is used for IE6
   * @private
   */
	hookEvents: function(){
		this.hookEvent(this.InputButton, "click", "onclick", this.callbackInputButtonClick);	
	},
	
  /**
	 * The click event on the button fired
   * @private
   */
	callbackInputButtonClick: function(){
		this.ValueHistoryEntry.inputButtonClick();
	},
	
  /**
	 * The iunput button was clicked
   * @private
   */
	inputButtonClick: function() {
		if(this.ValuesContainer.style.display == "block"){
			this.ValuesContainer.style.display = "none";			
		}
		else {
			this.ValuesContainer.style.display = "block";
      this.ValuesContainer.innerHTML = '<img src="images/progress-small.gif"/>loading...';

			var ajaxUrl = '';
      if (typeof this.AjaxUrl =='function') {
  			ajaxUrl = this.AjaxUrl();
			} else {
  			ajaxUrl = this.AjaxUrl;
			}

			var xmlHttpReq = false;
			var self = this;
			// Mozilla/Safari
			if (window.XMLHttpRequest) {
					self.xmlHttpReq = new XMLHttpRequest();
			}
			// IE
			else if (window.ActiveXObject) {
				self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
			}
			self.xmlHttpReq.onreadystatechange = function() {
					if (self.xmlHttpReq.readyState == 4) {
    					eval( 'data=' + self.xmlHttpReq.responseText + ';' );
							self.valuesLoaded( data );
					}
			}
			self.xmlHttpReq.open('GET', ajaxUrl, true);
			self.xmlHttpReq.send(null);

		}
	},
	
  /**
	 * The ajax returned and the values are now loaded
   * @private
   */
	valuesLoaded: function ( aData ) {
		if (aData.error) {
			this.ValuesContainer.innerHTML = '<span class="error">'+aData.error+'</span>';
		} else 
		if (aData.length==0) {
			this.ValuesContainer.innerHTML = '<em>No previous values were found.</em>';
		} else {
			var html = new Array();
			for ( item in aData ) {
				value = aData[item].value;

				if (aData[item].display) {
	  			display = aData[item].display;
				} else {
  				display = aData[item].value;
				}

				if (aData[item].info) {
  				html.push( '<a onclick="ValueHistoryEntryGlobals.Objects['+this.ObjectNumber+'].applyValue( \''+escape(value)+'\')">'+display+'</a>&nbsp;<span class="info">'+aData[item].info+'</span>');
				} else {
  				html.push( '<a onclick="ValueHistoryEntryGlobals.Objects['+this.ObjectNumber+'].applyValue( \''+escape(value)+'\')">'+display+'</a>');
				}

			}
  		this.ValuesContainer.innerHTML = html.join( '<br>' );
		}
	},
	
  /**
	 * A value needs to be applied
   * @private
   */
	applyValue: function ( aValue ) {
		this.InputElement.value = unescape( aValue );
		this.inputButtonClick();
	}

}