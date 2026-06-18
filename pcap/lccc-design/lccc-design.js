/**
 * Creates a new LCCCDesignManager class to manage the selection of style sheets
 * @class Represents a LCCCDesignManager 
 * @constructor
 */ 
var LCCCDesignManager = function(){
	
  // the base path for the design files
	this.BasePath = '/lccc-design/';
	
	// browser width threshold for mobile layout
	this.ThresholdMobile = 1027;
	
	// browser width threshold for narrow layout
	this.ThresholdNarrow = 1027;

	// remember the CSS Mode. 1=mobile, 2=Narrow, 3=normal
	this.CSSMode = 0;
	
	// toggle flag for expanding navigation
	this.NavigationExpanded = true;
	
	// toggle flag for expanding banner
	this.BannerExpanded = false;
	
	// List of sub menu animations
	this.SubMenuAnimations = new Array();
	
  if ( window.LCCCDesignManagerInst == undefined ) {
		// initialize the manager
		this.initialize();
		this.setCSS();
	} 
}

LCCCDesignManager.prototype = {

	/**
	 * debug to console
	 */
	debug: function( aMessage ) {
	  console.log( 'LCCCDesignManager: ' + aMessage );
	},

	/**
	 * throw an error
	 */
	error: function( aError ) {
	  throw new Exception( 'LCCCDesignManager: ' + aError );
	},

	/**
	 * initialize the manager
	 */
	initialize: function(){
		// grab the header banner
		this.HeaderBanner = document.getElementById( 'ld-header-banner' );

    // loop through header looking for CSS link to lccc-design.css
    var cssLinks = document.getElementsByTagName("link");
		for (var i=0; i<cssLinks.length; i++) {
      if (cssLinks.item(i).href != undefined) {

        // check for any of the 3 possible stylesheets
				if ( cssLinks.item(i).href.indexOf( 'lccc-design.css' )!= -1 || 
  				cssLinks.item(i).href.indexOf( 'lccc-design-normal.css' )!= -1 || 
  				cssLinks.item(i).href.indexOf( 'lccc-design-narrow.css' )!= -1 || 
					cssLinks.item(i).href.indexOf( 'lccc-design-mobile.css' )!= -1 ) {
					cssLinks.item(i).parentNode.removeChild(cssLinks.item(i));						
				}
			}
		}
		
		// if no stylesheet link was found create a new one
		if ( this.CSSElement == undefined ){

			// find the header element
      var cssHead = document.getElementsByTagName("head");
			if (cssHead.length == 0){
				this.Error( 'The HTML document does not have a head element.' );
			}
			headElement = cssHead.item(0);			

      // detect Safari and IE since switching requires removing and re-inserting css links in place of changin href
			this.SwitchCSSWithHref = true;
			ua = navigator.userAgent.toLowerCase(); 
			// IE
			if (ua.indexOf('msie') != -1){
				this.SwitchCSSWithHref = false;
				this.debug( 'Using force CSS switching for IE' );
			} else 
			if (ua.indexOf('safari') != -1){ 
        if(ua.indexOf('chrome') <= -1){
     			this.SwitchCSSWithHref = false;
 					this.debug( 'Using force CSS switching for Safari' );
  			}
			}

      // add CSS that will change when window resizes
			this.CSSElement = document.createElement( 'link' );
			this.CSSElement.rel = 'stylesheet';
			this.CSSElement.type = 'text/css';
      headElement.insertBefore(this.CSSElement, headElement.firstChild );	

      addCSS = function( aHeadElement, aFileName, aDisposeElement ) {
				// add base CSS that is static accross all modescssBase = document.createElement( 'link' );
				css = document.createElement( 'link' );
				css.rel = 'stylesheet';
				css.type = 'text/css';
				css.href = aFileName;						
				aHeadElement.insertBefore(css, aHeadElement.firstChild );	
				
				// element was only used for caching
				if ( aDisposeElement ) {
    			css.parentNode.removeChild(css);						
				}
			}

      // add base CSS base and pre-cache other stypes
			this.debug( 'Adding lccc-design.css to header' );
			addCSS( headElement, this.BasePath + 'lccc-design.css', false );

			this.debug( 'Caching size dependent css' );
			addCSS( headElement, this.BasePath + 'lccc-design-normal.css', true );
			addCSS( headElement, this.BasePath + 'lccc-design-narrow.css', true );
			addCSS( headElement, this.BasePath + 'lccc-design-mobile.css', true );

		}

    // set the correct browser width detection function
		// from window
		if (window.innerWidth && window.innerHeight) {
			this.getBrowserWidth = this.getBrowserWidthWindow;
		}	else 
		
		// from document
		if (document.compatMode=='CSS1Compat' &&
				document.documentElement &&
				document.documentElement.offsetWidth ) {
			this.getBrowserWidth = this.getBrowserWidthDocument;
		} else
		
		// from body
		if (document.body && document.body.offsetWidth) {
			this.getBrowserWidth = this.getBrowserWidthBody;
		} else {

  		// static
			this.getBrowserWidth = this.getBrowserWidthStatic;
		}
		
		// remember singleton
		window.LCCCDesignManagerInst = this;
		window.onresize = function(event) {
			window.LCCCDesignManagerInst.setCSS();
		};		
	},

	/**
	 * Initialize the navigation menu
	 */
  initMenu: function() {
		this.HeaderMenu = document.getElementById( 'ld-header-menu' );
		if ( this.HeaderMenu != undefined ) {
			
			subMenus = this.HeaderMenu.getElementsByClassName( 'ld-header-submenu' );
  		for (var i=0; i<subMenus.length; i++) {
				this.SubMenuAnimations[ i ] = new LCCCSubMenuAnimation( subMenus.item(i), i, this );
			}
		}
	},

	/**
	 * switch the CSS
	 */
  switchMode: function( aNewMode, aFileName ) {		
		if ( this.SwitchCSSWithHref ) {
			this.CSSElement.href = this.BasePath + aFileName;
		} else {
			oldCSS = this.CSSElement;
			this.CSSElement = document.createElement( 'link' );
			this.CSSElement.rel = 'stylesheet';
			this.CSSElement.type = 'text/css';
			this.CSSElement.href = this.BasePath + aFileName;
			headElement.insertBefore(this.CSSElement, oldCSS );	
			oldCSS.parentNode.removeChild(oldCSS);						
		}
		this.CSSMode = aNewMode;
	},

	/**
	 * set the correct CSS
	 */
	setCSS: function(){
		browserWidth = this.getBrowserWidth();

    // check for mobile mode
		if ( browserWidth <= this.ThresholdMobile ) {			
			if (this.CSSMode != 1) {        
				this.switchMode( 1, 'lccc-design-mobile.css' );
    		this.debug( 'Switching to MOBILE mode' );

        // reset styles manipulated by animations
				if ( this.HeaderBanner!= undefined ){
          this.HeaderBanner.style.height = '24px';
				}

        // reset styles manipulated by animations
				if ( this.HeaderMenu!= undefined ){
          this.HeaderMenu.style.height = '0px';
				}

        // reset all sub menus				
    		for (var i=0;i<this.SubMenuAnimations.length; i++) {
	  			this.SubMenuAnimations[ i ].hide();
				}
				
        this.NavigationExpanded = false;
			}
		} else

    // check for narrow mode
		if ( browserWidth <= this.ThresholdNarrow ) {
			if (this.CSSMode != 2) {
				this.switchMode( 2, 'lccc-design-narrow.css' );
				this.debug( 'Switching to NARROW mode' );

        // reset styles manipulated by animations
				if ( this.HeaderBanner!= undefined ){
          this.HeaderBanner.style.height = null;
				}

        // reset styles manipulated by animations
				if ( this.HeaderMenu!= undefined ){
          this.HeaderMenu.style.height = null;
				}
				
        // reset all sub menus				
    		for (var i=0;i<this.SubMenuAnimations.length; i++) {
	  			this.SubMenuAnimations[ i ].hide();
				}
				
			}
		} else {

      // check for normal mode
			if (this.CSSMode != 3) {
				this.switchMode( 3, 'lccc-design-normal.css' );
 				this.debug( 'Switching to NORMAL mode' );

        // reset styles manipulated by animations
				if ( this.HeaderBanner!= undefined ){
          this.HeaderBanner.style.height = null;
				}

        // reset styles manipulated by animations
				if ( this.HeaderMenu!= undefined ){
          this.HeaderMenu.style.height = null;
				}
				
        // reset all sub menus				
    		for (var i=0;i<this.SubMenuAnimations.length; i++) {
	  			this.SubMenuAnimations[ i ].hide();
				}
				
			}
		} 
		
	},
	
	/**
	 * get the browser width statically
	 */
	getBrowserWidthStatic: function(){
		return 630;
	},
	
	/**
	 * get the browser width from body
	 */
	getBrowserWidthBody: function(){
		return document.body.offsetWidth;
	},
	
	/**
	 * get the browser width from window
	 */
	getBrowserWidthWindow: function(){
		return window.innerWidth;
	},
	
	/**
	 * get the browser width from document
	 */
	getBrowserWidthDocument: function(){
		return document.documentElement.offsetWidth;
	},
	
	/**
	 * the navigationbutton was clicked
	 */
	eventNavigationClick: function() {
		if ( this.NavigationExpanded ) {
  		this.collapseNavigation();
		} else {
  		this.expandNavigation();
		}

		this.NavigationExpanded = !this.NavigationExpanded;
	},

	/**
	 * the banner button was clicked
	 */
	eventBannerClick: function() {
		if ( this.BannerExpanded ) {
  		this.collapseBanner();
		} else {
  		this.expandBanner();
		}

		this.BannerExpanded = !this.BannerExpanded;
	},
	
	/**
	 * collaps the navigation menu
	 */
	collapseNavigation: function (){
		
 	  height = this.HeaderMenu.offsetHeight - 100;

	  if( height <= 0 ){
    	clearTimeout( this.NavigationTimer );
			height = 0;
  	} else {
  	  this.NavigationTimer = setTimeout( 'window.LCCCDesignManagerInst.collapseNavigation()', 20 );
		}
		
    this.HeaderMenu.style.height = height+"px";
	}	,

	/**
	 * expand the navigation menu
	 */
	expandNavigation: function (){
	  height = this.HeaderMenu.offsetHeight + 65;
	  scrollHeight = this.HeaderMenu.scrollHeight;
		
	  if( height >= scrollHeight ){
    	clearTimeout( this.NavigationTimer );
      this.HeaderMenu.style.height = "auto";
  	} else {
  	  this.NavigationTimer = setTimeout( 'window.LCCCDesignManagerInst.expandNavigation()', 20 );
      this.HeaderMenu.style.height = height+"px";
		}
		
	},
	
	/**
	 * collaps the navigation menu
	 */
	collapseBanner: function (){
		
 	  height = this.HeaderBanner.offsetHeight - 15;

	  if( height <= 24 ){
    	clearTimeout( this.BannerTimer );
			height = 24;
  	} else {
  	  this.BannerTimer = setTimeout( 'window.LCCCDesignManagerInst.collapseBanner()', 20 );
		}
		
    this.HeaderBanner.style.height = height+"px";
	}	,

	/**
	 * expand the navigation menu
	 */
	expandBanner: function (){
	  height = this.HeaderBanner.offsetHeight + 15;
	  scrollHeight = this.HeaderBanner.scrollHeight;
		
	  if( height >= scrollHeight ){
    	clearTimeout( this.BannerTimer );
      this.HeaderBanner.style.height = "auto";
  	} else {
  	  this.BannerTimer = setTimeout( 'window.LCCCDesignManagerInst.expandBanner()', 20 );
      this.HeaderBanner.style.height = height+"px";
		}		
	}
	
}

/**
 * Creates a new LCCCSubMenuAnimation class to manage the subment animation
 * @class Represents a LCCCSubMenuAnimation 
 * @constructor
 */ 
var LCCCSubMenuAnimation = function( aElement, aMenuIndex, aDesignManager ){

  // remember the element of the sub menu
	this.Element = aElement;
	this.AnimationIndex = aMenuIndex;
	this.MouseOverSemaphor = 0;
	this.DesignManager = aDesignManager;

	// set submenu animation list
	if (window.SubMenuAnimations == undefined) {
		window.SubMenuAnimations = new Array();
	}	
	window.SubMenuAnimations[ aMenuIndex ] = this;
	
	anchors = aElement.parentNode.getElementsByTagName( 'A' );
	for (var i=0; i<anchors.length; i++) {
		anchors.item(i).setAttribute( 'onmouseover', 
  	  'window.SubMenuAnimations['+aMenuIndex+'].eventMouseOver();' );

		anchors.item(i).setAttribute( 'onclick', 
  	  'window.SubMenuAnimations['+aMenuIndex+'].eventMouseClick();' );

		anchors.item(i).setAttribute( 'onmouseout', 
  	  'setTimeout( function(){window.SubMenuAnimations['+aMenuIndex+'].eventMouseOut();}, 50 );' );
	}
}

LCCCSubMenuAnimation.prototype = {

	/**
	 * mouse was moved into element
	 */
  eventMouseOver: function() {
		// mouse events only is not mobile mode
		if ( this.DesignManager.CSSMode > 1 ) {
			this.MouseOverSemaphor++;
			clearTimeout( this.LoopTimer );
			this.expand();
		}
	},

	/**
	 * mouse was moved outside of element
	 */
  eventMouseOut: function() {
		// mouse events only is not mobile mode
		if ( this.DesignManager.CSSMode > 1 ) {
			this.MouseOverSemaphor--;
			if (this.MouseOverSemaphor == 0) {
				clearTimeout( this.LoopTimer );
				this.collapse();
			}
		}
	},

	/**
	 * mouse was clicked on the element
	 */
  eventMouseClick: function() {
		// mouse events only is not mobile mode
		if ( this.DesignManager.CSSMode == 1 ) {
			
			// collapse all other menus
  		for (var i=0; i<this.DesignManager.SubMenuAnimations.length; i++) {
				if (this.AnimationIndex != i) {
					this.DesignManager.SubMenuAnimations[i].collapse( true );
				}
			}
			
			clearTimeout( this.LoopTimer );
			this.expand();
		}
	},

	/**
	 * expand the element
	 */
	expand: function (){
	  height = this.Element.offsetHeight + 65;
	  scrollHeight = this.Element.scrollHeight;
		
	  if( height >= scrollHeight ){
    	clearTimeout( this.LoopTimer );
			height = scrollHeight;
  	} else {
  	  this.LoopTimer = setTimeout( 'window.SubMenuAnimations['+this.AnimationIndex+'].expand()', 20 );
		}
		
    this.Element.style.height = height+"px";
	},

	/**
	 * collaps the element
	 */
	collapse: function ( aFast ){
		
		if (aFast) {
  	  height = this.Element.offsetHeight - 200;
		} else {
  	  height = this.Element.offsetHeight - 100;
		}

	  if( height <= 0 ){
    	clearTimeout( this.LoopTimer );
			height = 0;
  	} else {
  	  this.LoopTimer = setTimeout( 'window.SubMenuAnimations['+this.AnimationIndex+'].collapse()', 20 );
		}
		
    this.Element.style.height = height+"px";
	},
	
	/**
	 * hide item by setting height to zero
	 */
	hide: function(){
    this.Element.style.height = "0px";
	}
	
}


window.onload = function() {
  new LCCCDesignManager();
  window.LCCCDesignManagerInst.initMenu(); 
}