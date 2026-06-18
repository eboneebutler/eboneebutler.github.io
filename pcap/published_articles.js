// Abstract toggler. Responsible for showing and hiding abstract in publication listing
var ToggleAbstract = function( aBoxId, aButtonId, aAbstractDivId ){
	this.Debugging = false;
	
	// manage list of all toggle classes
	if (window.ToggleAbstractIndex == undefined) {
		window.ToggleAbstractIndex = 0;
		window.ToggleAbstracts = new Array();
	} else {
		window.ToggleAbstractIndex++;
	}	
	this.ToggleAbstractIndex = window.ToggleAbstractIndex;
	window.ToggleAbstracts[this.ToggleAbstractIndex] = this;
	
	// get the box element
	this.BoxElement = document.getElementById( aBoxId );
	
	// check if it was found
	if (this.BoxElement ==undefined){
		alert( 'ToggleAbstract(): Box with ID='+aBoxId+' was not found!' );
		return;
	}
	if (this.Debugging) console.log('Grabbed box element ');

	// get the button element
	this.ButtonElement = document.getElementById( aButtonId );
	
	// check if it was found
	if (this.ButtonElement ==undefined){
		alert( 'ToggleAbstract(): Button with ID='+aButtonId+' was not found!' );
		return;
	}

	if (this.Debugging) console.log('Grabbed button element ');
	
	// get the div element for the abstract
	this.AbstractDivElement = document.getElementById(aAbstractDivId );

	// check the div element for the abstract
	if (this.AbstractDivElement ==undefined){
		alert( 'Abstract div with ID='+aAbstractDivId+' was not found!' );
		return;
	}
	if (this.Debugging) console.log('Grabbed abstract div element ');
	
	// the initial state is hidden
	this.Showing = false;
	
	// initialize element
	this.initialize();
}

// define methods on object
ToggleAbstract.prototype = {
	
	initialize: function() {
  	if (this.Debugging) console.log('initializing');
		
		this.ButtonElement.innerHTML = 'Show Abstract';
		this.BoxElement.setAttribute( 'onclick', 'window.ToggleAbstracts['+this.ToggleAbstractIndex+'].buttonClicked(event);' );
		this.ButtonElement.setAttribute( 'onclick', 'window.ToggleAbstracts['+this.ToggleAbstractIndex+'].buttonClicked(event);' );
		this.AbstractDivElement.style.display = "none";
	},
	
	buttonClicked: function (aEvent) {
		if (this.Showing == true ) {
  		this.ButtonElement.innerHTML = 'Show Abstract';
  		this.AbstractDivElement.style.display = "none";
			this.Showing = false;
		} else {
  		this.ButtonElement.innerHTML = 'Hide';
  		this.AbstractDivElement.style.display = "block";
			this.Showing = true;
		}
		console.log( 'buttonClicked(): Showing = ' + this.Showing );
		aEvent.stopPropagation();
	}	
}


