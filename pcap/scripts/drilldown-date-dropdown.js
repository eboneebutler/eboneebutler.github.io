/**
 * @fileOverview This file contains a component adapter for a drill down date dropdown
 * @author <a href="mailto:adrian.meyer@unc.com">Adrian Meyer</a>
 * @version 1.0.0
 */
 
/**
 * DrillDownDateDropDownOptions holding defaults to creating a dropdown
 * @class Represents a DrillDownDateDropDownOptions
 */ 
var DrillDownDateDropDownOptions = function(){
	/**
	 * Default decade to be selected on initial popup or when date is cleared. 0=current decade, -1 past decade, 1=future decade
	 * @public
	 */
  this.DefaultDecade = null,
	/**
	 * Starting decade to be listed. 
	 * @public
	 */
	this.FromDecade = -11,
	/**
	 * Ending decade to be listed. 
	 * @public
	 */
	this.ToDecade = 1
	/**
	 * Date format to be used for display
	 * @public
	 */
  this.DateFormat = "paddedDate";	
}

/**
 * Creates a new DrillDownDateDropDown adapter by passing a text input element and a date format
 * @param {String} aInputElement A reference to an input HTML element of the type text
 * @param {String} aDateFormat Preferred date format for display
 * @param {Object} aOptions Object with properties for defailts. , 
 * @class Represents a DrillDownDateDropDown 
 * @constructor
 */ 
var DrillDownDateDropDown = function( aInputElement, aOptions ){

	/**
	 * Date format to be used. Passed in the constructore
	 * @private
	 */
  this.DateFormat = "paddedDate";
  if ( aOptions != undefined && aOptions.DateFormat != undefined )
    this.DateFormat = aOptions.DateFormat;

	//check for passed input control
	if(aInputElement==undefined){
//		alert("DrillDownDateDropDown(): Element has to be passed to the constructor.");
		return;
	}
	
	//In case the passed element is not of type text assume we have a readonly element
	if(aInputElement.type != 'text'){

		var readOnlyDate = aInputElement.innerHTML;
		if (readOnlyDate.length >= 10) {
			var readOnly = new Date(readOnlyDate.substring(0,4),readOnlyDate.substring(5,7)-1,readOnlyDate.substring(8,10));
			aInputElement.innerHTML = readOnly.format( this.DateFormat );
		}

		return;
	}

	//checks for multiple adapters on the same input control
	if(aInputElement.DrillDownDateDropDown){
		alert("DrillDownDateDropDown(): Input element " + aInputElement.name + " has already a DrillDownDateDropDown.");
		return;
	}

	/**
	 * Default decade displayed when date is cleared or initialized. 0 = current, -1 = last, -2 = one before last, ...
	 * @private
	 */
  this.DefaultDecade = null;
  if ( aOptions != undefined && aOptions.DefaultDecade != undefined )
    this.DefaultDecade = aOptions.DefaultDecade;
	var today = new Date();	
	/**
	 * First year of the current decade. 
	 * @private
	 */
	this.CurrentDecade = Math.floor( today.getFullYear() / 10 ) * 10;

	/**
	 * Default starting decade used when listing decades
	 * @private
	 */
  this.FromDecade = -11;
  if ( aOptions != undefined && aOptions.FromDecade != undefined )
    this.FromDecade = aOptions.FromDecade;
		
	/**
	 * Default ending decade used when listing decades
	 * @private
	 */
  this.ToDecade = 1;
  if ( aOptions != undefined && aOptions.ToDecade != undefined )
    this.ToDecade = aOptions.ToDecade;

  /**
   * Reference to original input element
   * @public
   */
	this.InputElement = aInputElement;
	this.InputElement.DrillDownDateDropDown = this;
	this.InputElement.setAttribute("readonly", "readonly");	
	this.InputElement.setAttribute("class", "date-drop-down");	
	this.InputElement.setAttribute("class", "drillDownDateInput");		
	
  /**
   * Hidden input element taking over the name that holds the MySQL formatted date/time
   * @public
   */
	this.ValueElement = document.createElement("input");
	this.ValueElement.setAttribute("type", "hidden");		
	this.ValueElement.setAttribute("name", this.InputElement.name );
	this.InputElement.parentNode.appendChild( this.ValueElement );
	this.InputElement.removeAttribute("name");
	
  /**
   * Javascript date object holding the current date/time
   * @public
   */
	var savedDate = aInputElement.value;
	if (savedDate.length >= 10) {
		var savedYear = (savedDate.substring(0,4));
		var savedMonth = (savedDate.substring(5,7));
		var savedDay = (savedDate.substring(8,10));
		this.Date = new Date(savedYear,savedMonth-1,savedDay);
		this.setMysqlDateTime( savedDate ); 
	}
	else {
		this.Date = new Date();
//		alert(this.Date);
		this.setMysqlDateTime('');
	}
  this.render();
}	
	
var BUTTON_TYPE_CENTURY = 1;	
var BUTTON_TYPE_YEAR = 2;
var BUTTON_TYPE_MONTH = 3;
var BUTTON_TYPE_DAY = 4;
	
DrillDownDateDropDown.prototype = {

  InputElement: false,
	
  /**
	 * Render the needed HTML
   * @private
   */
	render: function (){
		
		var parentNode = this.InputElement.parentNode;
		
		//create the clear button 
		this.ClearButton = document.createElement("input");
		this.ClearButton.type= "button";
		this.ClearButton.value= "X";
		this.ClearButton.setAttribute( "style", "vertical-align:middle" );
		this.ClearButton.DrillDownDateDropDown= this;
		parentNode.appendChild(this.ClearButton);		

    this.EditButton = document.createElement("input");
		this.EditButton.type= "button";
		this.EditButton.value= "Edit";
		this.EditButton.setAttribute( "style", "vertical-align:middle" );
		this.EditButton.DrillDownDateDropDown= this;
		parentNode.appendChild(this.EditButton);		

    //create div with date buttons
		this.addDropDownContainer(parentNode);
		
		this.hideContainers();
		
		// attach all events
		this.hookEvents();		
	},
	
	
  /**
	 * Set the date on the component passing a mysql date time string 
   * @param {String} aMysqlDateTimeString A string with a valid mysql date string or blank
   * @public
   */
	setMysqlDateTime: function ( aMysqlDateTimeString ){
		this.Date.setMySQLDateTime( aMysqlDateTimeString );
		if (aMysqlDateTimeString.trim() != '' && this.Date.isValid()) {
			this.Decade = Math.floor(( this.Date.getFullYear() - this.CurrentDecade ) / 10 );
			this.Year = this.Date.getFullYear();
			this.Month = this.Date.getMonth();
			this.Day = this.Date.getDate();
			this.InputElement.value = this.Date.format( this.DateFormat );
			this.ValueElement.value = this.Date.format( "mysqlDateTime" );
		} else {
			this.Decade = this.DefaultDecade;
			this.Year = -1;
			this.Month = -1;
			this.Day = -1;
			this.InputElement.value = "";
			this.ValueElement.value = "";
		}
		this.Date.setHours( 0 );
		this.Date.setMinutes( 0 );
		this.Date.setSeconds( 0 );
		this.Date.setMilliseconds( 0 );
		this.updateDisplay();
	},

  /**
	 * Set the component as read only
   * @param {Bool} aReadOnlyFlag A flag prepresenting the read only state. true=read only, false=editable
   * @public
   */
	setReadOnly: function(aReadOnlyFlag){	
	  if (aReadOnlyFlag) {
  		this.ClearButton.setAttribute( "disabled", "disabled" );
  		this.EditButton.setAttribute( "disabled", "disabled" );
			this.hideContainers();
		} else {
  		this.ClearButton.removeAttribute( "disabled" );
  		this.EditButton.removeAttribute( "disabled" );
		}
	},
	
  /**
	 * Create the internal drop down container
   * @private
   */
	addDropDownContainer: function(aParentNode){	
		this.DropDownContainer = document.createElement("div");
		this.DropDownContainer.className = "drillDownDateDropDown";
		aParentNode.appendChild(this.DropDownContainer);		
		
    // create the cancel button
		var buttonDiv = document.createElement("div");
		buttonDiv.className = "buttonWrapper";
		buttonDiv.innerHTML = 
		  "<input type='button' value='Close' class='button' onmouseover='this.className=\"button buttonHover\"' onmouseout='this.className=\"button\"'>"+
			"<input type='button' value='Today' class='button' onmouseover='this.className=\"button buttonHover\"' onmouseout='this.className=\"button\"'>"+
			"<em>Click buttons to select date</em>";
		this.DropDownContainer.appendChild( buttonDiv );	
		this.CancelButton = buttonDiv.childNodes[0];
		this.CancelButton.DrillDownDateDropDown = this;
		this.TodayButton = buttonDiv.childNodes[1];
		this.TodayButton.DrillDownDateDropDown = this;
		
		// array containing all the buttons`
		this.Buttons = Array();

    // add decade buttons
		var index = 0;
		for ( var i = this.ToDecade; i>=this.FromDecade; i-- )
  		this.Buttons.push( {Element: null, X:0, Y:index++, Label:( this.CurrentDecade + (i*10))+ "s", Type: BUTTON_TYPE_CENTURY, Value:i } );
		
    // add year buttons
		var index = 0;
		for ( var i in ["0","1","2","3","4","5","6","7","8","9" ] )
  		this.Buttons.push( {Element: null, X:1, Y:index++, Label:i, Type: BUTTON_TYPE_YEAR, Value: i } );
		
    // add month buttons
		var index = 0;
		var buttons = ["Jan (01)","Feb (02)","Mar (03)","Apr (04)","May (05)","Jun (06)","Jul (07)","Aug (08)","Sep (09)","Oct (10)" ,"Nov (11)" ,"Dec (12)" ];
		for ( var i in buttons )
  		this.Buttons.push( {Element: null, X:2, Y:index++, Label:buttons[i], Type: BUTTON_TYPE_MONTH, Value: index - 1 } );
			
    // add day buttons
		for (var i=0;i<=29;i++) {
  		this.Buttons.push( {Element: null, X: 3 + Math.floor(i/10), Y:i%10, Label:i+1, Type: BUTTON_TYPE_DAY, Value:i+1 } );
		}
 		this.Buttons.push( {Element: null, X: 5, Y:10, Label:31, Type: BUTTON_TYPE_DAY, Value:31 } );
		
		// generate the DOM
		var table = document.createElement("table");
		table.setAttribute( "cellspacing", "0" );
		table.setAttribute( "cellpadding", "0" );
		this.DropDownContainer.appendChild( table );

		var thead = document.createElement("thead");
		var header = document.createElement("tr");
		var th = document.createElement("th");
		th.innerHTML = "Decade";
		header.appendChild(th);
		var th = document.createElement("th");
		th.innerHTML = "Year";
		header.appendChild(th);
		var th = document.createElement("th");
		th.innerHTML = "Month";
		header.appendChild(th);
		var th = document.createElement("th");
		th.innerHTML = "Day";
		th.colspan = "3";
		header.appendChild(th);
		table.appendChild( thead );
		thead.appendChild(header);
		
		// loop through the grid and fill in buttons
		for (var Y=0;Y<=11;Y++) {

			var tbody = document.createElement("tbody");
			var row = document.createElement("tr");
		  table.appendChild( tbody );
			tbody.appendChild(row);
			
  		for (var X=0;X<=5;X++) {
				var cell = document.createElement("td");
				row.appendChild( cell );

        // fund the button
        for ( var button in this.Buttons ) 
				  if (this.Buttons[button].X==X && this.Buttons[button].Y==Y) {
						this.Buttons[button].Element = document.createElement("input");
						this.Buttons[button].Element.type = "button";
						this.Buttons[button].Element.className = "drillDownDateButton";
      			this.Buttons[button].Element.style.color = "#666";
						this.Buttons[button].Element.value = this.Buttons[button].Label;
						this.Buttons[button].Element.DrillDownDateDropDown = this;
						this.Buttons[button].Element.DrillDownButton = this.Buttons[button];
						cell.appendChild( this.Buttons[button].Element );
  				}
			}

		}

	},
	
  /**
	 * Setup the display of the one passed button
   * @param {Bool} aHide A flag prepresenting if the button is hidden. true=hide, false=show
   * @param {Bool} aHighLight A flag prepresenting if the button is highlighted. true=highlight, false=normal
   * @param {HTMLElement} aButton A reference to an HTML element representing the button the values will be applied to
   * @private
   */
	displayButton: function( aHide, aHighLight, aButton ) {
		if (aHide)
			aButton.Element.setAttribute( "style", "display:none" );
    else if (aHighLight) 
			aButton.Element.setAttribute( "style", "color:#000000;font-weight:bold" );
		else
			aButton.Element.setAttribute( "style", "color:#666" );
	},
	
  /**
	 * Update the display of all the buttons
   * @private
   */
	updateDisplay: function(){
    var daysOfMonth = 0;

		for ( var button in this.Buttons ) 
			switch (this.Buttons[button].Type) {
				
				// check for the decade buttons
				case BUTTON_TYPE_CENTURY: 
				  if (this.Decade == this.Buttons[button].Value) {
					  this.Buttons[button].Element.setAttribute( "style", "color:#000000;font-weight:bold" );
				
				    // set the year buttons to the correct values
						var index = 0;
        		for ( var yearButton in this.Buttons ) 
						  if (this.Buttons[yearButton].Type == BUTTON_TYPE_YEAR) {
  						  this.Buttons[yearButton].Value = this.CurrentDecade + ( this.Decade * 10 ) + index++;
  						  this.Buttons[yearButton].Label = this.Buttons[yearButton].Value;
  						  this.Buttons[yearButton].Element.value = this.Buttons[yearButton].Value;
							}
						
					} else
					  this.Buttons[button].Element.setAttribute( "style", "color:#666" );
						
					break;

				case BUTTON_TYPE_YEAR:				
					this.displayButton( this.Decade == null, this.Year == this.Buttons[button].Value, this.Buttons[button] );						
					break;
					
				case BUTTON_TYPE_MONTH: 
				  // remember how many days are in the month
				  if (this.Month == this.Buttons[button].Value) {
  					daysOfMonth = 32 - new Date(this.Year, this.Buttons[button].Value, 32).getDate();
					}

					this.displayButton( this.Year < 0, this.Month == this.Buttons[button].Value, this.Buttons[button] );						
					break;

        case BUTTON_TYPE_DAY: 
				  dayDate = new Date(this.Year, this.Month, this.Buttons[button].Value );

				  this.Buttons[button].Element.value = this.Buttons[button].Value + ' (' + dayDate.format( 'ddd' ) + ')';
					this.displayButton( this.Month < 0 || this.Buttons[button].Value > daysOfMonth, this.Day == this.Buttons[button].Value, this.Buttons[button] );						
					break;
			}
	},
	
  /**
	 * Hides the drop down
   * @private
   */
	hideContainers: function(){
		this.DropDownContainer.style.display = "none";
	},
	
  /**
	 * Attach click events to buttons
	 * @private
   */
	hookEvents: function(){
		for ( var button in this.Buttons ) 
			switch (this.Buttons[button].Type) {
				case BUTTON_TYPE_CENTURY: 
					addObjectEventFunction(this.Buttons[button].Element, "click", jsCurry(this.callbackDecadeButtonClick, this.Buttons[button].Element, []));
					break;
				case BUTTON_TYPE_YEAR: 
					addObjectEventFunction(this.Buttons[button].Element, "click", jsCurry(this.callbackYearButtonClick, this.Buttons[button].Element, []));
					break;
				case BUTTON_TYPE_MONTH: 
					addObjectEventFunction(this.Buttons[button].Element, "click", jsCurry(this.callbackMonthButtonClick, this.Buttons[button].Element, []));
					break;
				case BUTTON_TYPE_DAY: 
					addObjectEventFunction(this.Buttons[button].Element, "click", jsCurry(this.callbackDayButtonClick, this.Buttons[button].Element, []));
					break;
			}
			addObjectEventFunction(this.CancelButton, "click", jsCurry(this.callbackCancelButtonClick, this.CancelButton, []));
			addObjectEventFunction(this.TodayButton, "click", jsCurry(this.callbackTodayButtonClick, this.TodayButton, []));
			addObjectEventFunction(this.EditButton, "click", jsCurry(this.callbackEditButtonClick, this.EditButton, []));
			addObjectEventFunction(this.ClearButton, "click", jsCurry(this.callbackClearButtonClick, this.ClearButton, []));
	},
	
  /**
	 * Decade button was clicked
	 * @private
   */
	callbackDecadeButtonClick: function(){
		this.DrillDownDateDropDown.Decade = this.DrillDownButton.Value;
		this.DrillDownDateDropDown.Year = -1;
		this.DrillDownDateDropDown.Month = -1;
		this.DrillDownDateDropDown.Day = -1;
		this.DrillDownDateDropDown.InputElement.value = ( this.DrillDownDateDropDown.CurrentDecade + (10* this.DrillDownButton.Value)) + " - " + (this.DrillDownDateDropDown.CurrentDecade + (10* this.DrillDownButton.Value) + 9);
		this.DrillDownDateDropDown.ValueElement.value = '';
		this.DrillDownDateDropDown.updateDisplay();
	},
	
  /**
	 * A year button was clicked
	 * @private
   */
	callbackYearButtonClick: function(){ 
		this.DrillDownDateDropDown.Year = this.DrillDownButton.Value;
		this.DrillDownDateDropDown.Month = -1;
		this.DrillDownDateDropDown.Day = -1;
		this.DrillDownDateDropDown.updateDateDisplay( 1, 1, 'yyyy' ); 
		this.DrillDownDateDropDown.updateDisplay();
	},
	
  /**
	 * A month button was clicked
	 * @private
   */
	callbackMonthButtonClick: function(){
		this.DrillDownDateDropDown.Month = this.DrillDownButton.Value;
		this.DrillDownDateDropDown.Day = -1;
		this.DrillDownDateDropDown.updateDateDisplay( this.DrillDownDateDropDown.Month, 1, 'mmm yyyy' );
		this.DrillDownDateDropDown.updateDisplay();
	},
	
  /**
	 * A day button was clicked
	 * @private
   */
	callbackDayButtonClick: function(){
		this.DrillDownDateDropDown.Day = this.DrillDownButton.Value;
		this.DrillDownDateDropDown.updateDateDisplay( this.DrillDownDateDropDown.Month, this.DrillDownDateDropDown.Day, this.DrillDownDateDropDown.DateFormat );
		this.DrillDownDateDropDown.hideContainers();
	},
	
  /**
	 * Updates the internal date object and changes the display with a given format
   * @param {Integer} aMonth The month to be displayed
   * @param {Integer} aDay The day to be displayed
   * @param {String} aDateFormat A format used for the display
   * @private
   */
	updateDateDisplay: function( aMonth, aDay, aDateFormat ){
    this.Date.setFullYear( this.Year );
		this.Date.setMonth( aMonth );
		this.Date.setDate( aDay );
		this.InputElement.value = this.Date.format( aDateFormat );
		this.ValueElement.value = this.Date.format( 'mysqlDateTime' );
		console.log(this.ValueElement.value);
	},		
	
  /**
	 * [Edit] button was clicked. Toggles the drop down
	 * @private
   */
	callbackEditButtonClick: function(){
		if (this.DrillDownDateDropDown.DropDownContainer.style.display == "block") {
  		this.DrillDownDateDropDown.cancel();
		} else {
			this.DrillDownDateDropDown.OriginalValue = this.DrillDownDateDropDown.ValueElement.value;
			this.DrillDownDateDropDown.DropDownContainer.style.display = "block";
			this.DrillDownDateDropDown.updateDisplay();
		}
	},
	
  /**
	 * [X] (clear) button was clicked
	 * @private
   */
	callbackClearButtonClick: function(){
		this.DrillDownDateDropDown.setMysqlDateTime( '' );
		this.DrillDownDateDropDown.hideContainers();
	},
	
  /**
	 * [Cancel] button was clicked. sets the old value back
	 * @private
   */
	callbackCancelButtonClick: function(){
		this.DrillDownDateDropDown.cancel();
	},	
	
  /**
	 * Cancels the entry and hides the dropdown
	 * @private
   */
	cancel: function(){
		this.hideContainers();		
		this.setMysqlDateTime( this.OriginalValue );
	},	
	
  /**
	 * [Today] button was clicked. select todays date
	 * @private
   */
	callbackTodayButtonClick: function(){
		this.DrillDownDateDropDown.setToday();
		this.DrillDownDateDropDown.hideContainers();
	},	
	
  /**
	 * Sets the date to today
	 * @private
   */
	setToday: function(){
		today = new Date();
		this.setMysqlDateTime( today.format( "yyyy-mm-dd" ) + ' 00:00:00' );
	}
	
}