

//http://obvcode.blogspot.com/2007/11/easiest-way-to-check-ie-version-with.html
// 	if (ieBrowser.Version<7) { }
var ieBrowser = {
  Version: function() {
    var version = 999; // we assume a sane browser
    if (navigator.appVersion.indexOf("MSIE") != -1)
      // bah, IE again, lets downgrade version number
      version = parseFloat(navigator.appVersion.split("MSIE")[1]);
    return version;
  }
}

/*
// ---------------------------------------------------------------
// Allow extension of class properties and methods
// ---------------------------------------------------------------
Function.prototype.extends = function(extendsClass) {
	// Modify based on custom properties
	for (var p in extendsClass) { this[p] = extendsClass[p]; }
	// Modify based on custom prototype
	for (var p in extendsClass.prototype) { this[p] = extendsClass.prototype[p]; }
}
*/

var class_extends = function(c, extendsClass) {
	// Modify based on custom properties
	for (var p in extendsClass) { c[p] = extendsClass[p]; }
	// Modify based on custom prototype
	for (var p in extendsClass.prototype) { c[p] = extendsClass.prototype[p]; }
}

// ---------------------------------------------------------------
// Update the value of a property for all elements of a class
// ---------------------------------------------------------------
function changeClassStyleProperty(classname,prop,val) {
	var cns = document.getElementsByClassName(classname);
	for (var i in cns) {
		cns[i].style[prop] = val;
	}
}

/*
// ----------------------------------------------------------------
// http://stackoverflow.com/questions/1181575/
//		javascript-determine-whether-an-array-contains-a-value
// ----------------------------------------------------------------
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i]+"" === needle+"") {
                return i;
            }
        }
        return -1;
    };
}
*/


// ----------------------------------------------------------------
// Allows use of shorthand $('some_element_id')
// 	instead of document.getElementById('some_element_id')
// ----------------------------------------------------------------
var _ELEMENTS = [];
function $(x) {
	var r = false;
	if (!(r=_ELEMENTS[x])) {
		if (_ELEMENTS[x] = document.getElementById(x)) {
//			alert("Getting " + x + " for the first time.");
			r = _ELEMENTS[x];
		}
	}
	return r;
}
// ----------------------------------------------------------------


// Nicely format a yyyy-mm-dd hh:mm:ss timestamp
function formatDateTime(ts, fm) {
	var r = ts;
	try {
		if (!fm) {
			fm = "dddd, mmmm dS, yyyy, h:MM:ss TT";
		}
		var dt = new Date(ts.replace("-"," ","g"));
		r = dt.format(fm);
	} catch(er) {
		r = ts;
	}
	return r;
}

// Clear highlighted selections on entire page
// Source: http://stackoverflow.com/questions/880512/prevent-text-selection-after-double-click
function clearHighlightedSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
}



// pass-through for window.open, for reasons described here:
// http://stackoverflow.com/questions/710756/ie8-var-w-window-open-message-invalid-argument
function window_open(url,name,extras) {
	var w;
	var extras = (!extras) ? "scrolling=1,scrollbars=1,status=1,location=1,menubar=1" : other;
	try {
		w = window.open(url,name,extras);
	} catch(er) {
		w = window.open(url,"",extras);
	}
	return w;
}

//Unchecks all checkboxes inside of an element
function uncheckCheckboxes (box){
	var cbs=box.getElementsByTagName("input");
	for(var i in cbs) {
		if(cbs[i].type=="checkbox"){
			cbs[i].checked=false;	
		}
	}
}

// Strips trailing zeros from a string and returns as string
var stripPrecedingZeros = function(x) {
	var r = ""+x;
	while(r.length>1 && r[0]=="0") {
		r = r.substring(1,r.length);
	}
	return r;
}



// ----------------------------------------------------------------------------------

function trim(str, chars) {
    return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}


function cssHasClass(d,c)
{
	if (!(d.className)) { d.className = ""; }
	var dc = d.className.split(" ");
	for (var i=0;i<dc.length;i++)
	{
		if (dc[i]==c)
		{
			return true;
		}
	}
	return false;
}

function cssAddClass(d,c)
{
	cssRemoveClass(d,c);
	d.className = trim(d.className + " " + c);
}

function cssRemoveClass(d,c)
{

	var cn = "" + d.className;
	if ( (cn=="undefined") )
	{
		cn = "";
	}
	var dc = cn.split(" ");
	cn = "";
	for (var i=0;i<dc.length;i++)
	{
		if (dc[i]!=c)
		{
			cn += (" " + dc[i]);
		}
	}

	try
	{
		d.className = trim(cn);
	}
	catch(err)
	{
//		document.getElementById("debug").innerHTML = "(test): " + err + "<hr />";
		try
		{
			d.setAttribute("class",trim(cn));
		}
		catch(err)
		{
	//		document.getElementById("debug").innerHTML = "(test): " + err + "<hr />";
		}
	}


}



// ----------------------------------------------------------------------------------

var addTableRow = function(table, cells, thtd) {
	if (!thtd) { thtd = "td"; }
	if (ieBrowser.Version() < 8) {
		// http://msdn.microsoft.com/en-us/library/ms532998%28v=vs.85%29.aspx
		var row = table.insertRow();
		for (var i in cells) {
			if (thtd=="th") {
				var cell = document.createElement(thtd);
				cell.innerHTML = cells[i];
				row.appendChild(cell);
			} else {
				var cell = row.insertCell();
				cell.innerHTML = cells[i];
			}
		}
	}
	else {
		var row = document.createElement("tr");
		for (var i in cells) {
			var cell = document.createElement(thtd);
			cell.innerHTML = cells[i];
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	return row;
}

// http://james.padolsey.com/javascript/get-document-height-cross-browser/
function getDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}



function array_contains(a, v)
{
	if (a!=null)
	{
		for (var i=0;i<a.length;i++)
		{
			if (a[i]==v) { return true; }
		}
	}
	return false;
}


var getFrameDocument = function(IFrameObj)
{
  if (IFrameObj.contentDocument) {
    // For NS6
    return IFrameObj.contentDocument; 
  } else if (IFrameObj.contentWindow) {
    // For IE5.5 and IE6
    return IFrameObj.contentWindow;
  } else if (IFrameObj.document) {
    // For IE5
    return IFrameObj.document;
  } else if (IFrameObj.window) {
    // For IE5
    return IFrameObj.window.document;
  } else {
		return false;
  }
}

// Get first ancestor tag of an element with the provided tag name
// (useful for obtaining table rows containing embedded tags, for example)
var getAncestorByTagName = function(element, tagname)
{
	while (element.parentNode!=null) {
		element = element.parentNode;
		if (element.tagName.toUpperCase()==tagname.toUpperCase()) {
			return element;
		}
	}
	return false;
}



function leadDigits(n, d)
{
	var s = n.toString();
	while (s.length < d)
	{
		s = "0" + s;
	}
	return s;
}


var fillButton = function(aAnchorProperties, aImage, aCaption, aClassName) {
		if (!aClassName) { aClassName = "button-action"; }
		var html = "";
		html+= "<a";
		if (!aAnchorProperties) { aAnchorProperties = false; }
		else {
			for ( var i in aAnchorProperties ) {
				html+= " " + i + "=\"" + aAnchorProperties[i] + "\"";
			}
		}
		html+= ">";
			html+= "<div class='"+aClassName+"-left'></div>";		
			html+= "<div class='"+aClassName+"-center'>";
				if (aImage!="") {
					if ( aImage.match( "^/tracking/" ) != "/tracking/" ) {
						aImage = "/images/"+aImage;
					}
					html+= "<div class='"+aClassName+"-image' style='background-image:url("+aImage+")'></div>";
				}
				html+= "<div class='"+aClassName+"-text'>"+aCaption+"</div>";
			html+= "</div>";
			html+= "<div class='"+aClassName+"-right'></div>";		
		html+= "</a>";
	html+= "</div>";
	return html;
}

var createButton = function(aAnchorProperties, aImage, aCaption, aClassName)
{
		if (!aClassName) { aClassName = "button-action"; }
		var button = document.createElement("div");
		button.className = aClassName;
	  button.innerHTML += fillButton(aAnchorProperties, aImage, aCaption, aClassName);
		return button;
}


var getSelectedOptionText = function(selectID)
{
	// Source: http://codesnippets.joyent.com/posts/show/1754
	var select_list_field = document.getElementById(selectID);
	var select_list_selected_index = select_list_field.selectedIndex;
	var text = select_list_field.options[select_list_selected_index].text;
	return text;
}

var alertObjectVars = function(a)
{
	var al = ""; for (var i in a) { al += i + ": " + a[i] + " | "; } alert(al);
}

var getObjectProperties = function(a)
{
	var al = ""; for (var i in a) { al += i + ": " + a[i] + "\n"; } return al;
}

var alertObjectProperties = function(a)
{
	var al = ""; for (var i in a) { al += i + ": " + a[i] + "\n"; } alert(al);
}

var array_has_value = function(a, v)
{
	for (var i in a) {
		if (a[i]==v) { return true; }
	}
	return false;
}

var array_has_property_value = function(a, p, v)
{
	for (var i in a) {
		if (a[i][p]==v) { return true; }
	}
	return false;
}

var array_remove = function(a, v)
{
	var r = [];
	for (var i=0;i<a.length;i++)
	{
		if (a[i]!=v)
		{
			r.push(a[i]);
		}
	}
	return r;
}

// Add .getElementsByClassName method to document element
document.getElementsByClassName = function(cl) {
	var retnode = [];
	var myclass = new RegExp('\\b'+cl+'\\b');
	var elem = this.getElementsByTagName('*');
	for (var i = 0; i < elem.length; i++) {
	var classes = elem[i].className;
	if (myclass.test(classes)) retnode.push(elem[i]);
	}
	return retnode;
};

	


// Resource: http://www.dustindiaz.com/javascript-curry/
// This variation accepts an array of args (can be null or nonexistent) 
var jsCurry = function(fn, scope, args)
{
	var scope = scope || window;
	if (!args) { args = []; }
	return function() {
		fn.apply(scope, args);
	};
}

var jsCurrier = function(fn, scope, args) {
	this.Scope = scope || window;
	this.Args = (!args) ? [] : args;
	this.Fun = fn;
	return this;
}




// Return the unicode for a event keystroke
function getKeyUnicode(e)
{
	var unicode = e.keyCode? e.keyCode : e.charCode;
	return unicode;
}


function realGetElementById(element_id)
{
	if (!document.all)
	{
		return document.getElementById(element_id);
	}
	else
	{
		try
		{
			var a = document.all;
			for (var i=0;i<a.length;i++)
			{
				if (a[i].id==element_id)
				{
					return a[i];
				}
			}
		}
		catch (er) { return document.getElementById(element_id); }
	}
}

// Get URL parameter value (e.g. ?somevar=someval)
// SOURCE: http://www.netlobo.com/url_query_string_javascript.html
function urlGetParameter( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}




// Add to an object listener (without disrupting existing listener)
var addObjectEventFunction = function(obj, evt, fun)
{
		if (obj!=null) {
			if (obj.attachEvent) // Microsoft
			{
				obj.attachEvent('on'+evt, fun);
			}
			else if (obj.addEventListener) // W3C standard
			{
				obj.addEventListener(evt, fun, false);
			} 
	}
}

/**
 * Highlights the specified terms in a string
 * @param {termString} the terms to highlight (space-delimited)
 */ 
String.prototype.highlightTerms = function(termString)
{
	var r = this;
	termString = termString.trim();
	if (termString!="")
	{
		try {
			termString = termString.replace(","," ");
			terms = termString.split(" ");
			for (var i=0;i<terms.length;i++)
			{
				terms[i] = terms[i].replace(".","\\.","g");
				var re0 = RegExp("\\b(|\\()("+terms[i]+")","gi");
				r = r.replace(re0, "[{[$2]}]");
			}
			var re1 = RegExp("\\[\\{\\[","g");
			r = r.replace(re1, "<span class=\"highlighted\">");
			var re2 = RegExp("\\]\\}\\]","g");
			r = r.replace(re2, "</span>");
		} catch (er) {  }
	}
	return r;
}
 

// Apply highlightTermsInString(...) to a DOM Element's innerHTML
function highlightTermsInDOM(domElement, aTerms) {
	if (!(domElement)) { domElement = document.body; }
	var deHTML = domElement.innerHTML;
	deHTML = deHTML.highlightTerms(aTerms);
	domElement.innerHTML = deHTML;
}







 // set the visibility of an element or on the element with the given ID
 function setVisible(aTarget, aVisible) {
		if (typeof aTarget == 'string') {
		  element = document.getElementById( aTarget );
		} else {
		  element = aTarget;
		}

		if (aVisible) {
			if ( element.tagName == 'TR' )
			element.style.display = 'table-row';
		else
			if ( element.tagName == 'TD' )
			element.style.display = 'table-cell';
		else
			if ( element.tagName == 'SPAN' )
			element.style.display = 'inline';
		else
			if ( element.tagName == 'INPUT' )
			element.style.display = 'inline';
		else
			if ( element.tagName == 'IMG' )
			element.style.display = 'inline';
		else
			if ( element.tagName == 'DIV' )
			element.style.display = 'block';
		else
			element.removeAttribute('style');   
		} else
		element.style.display = 'none';
  }


	// add trim functionality to all browser
	String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g,"");
	}
	String.prototype.ltrim = function() {
			return this.replace(/^\s+/,"");
	}
	String.prototype.rtrim = function() {
			return this.replace(/\s+$/,"");
	}
	
	
