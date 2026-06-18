

function parseJSON(j) {
	var r = new Array();
	try {
		r = eval('('+j+')');
	}
	catch(er) {
		return r;
	}
	return r;
}

// ----------------------------------------------------------------------------------

function ajax_trim(str, chars) {
    return ajax_ltrim(ajax_rtrim(str, chars), chars);
}

function ajax_ltrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function ajax_rtrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

// ----------------------------------------------------------------------------------

function GetXmlHttpObject() {
  var xmlHttp=null;
  try {
    // Firefox, Opera 8.0+, Safari, etc
    xmlHttp=new XMLHttpRequest();
  }
  catch (e) {
    // Internet Explorer
    try {
      xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e) {
      xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  return xmlHttp;
}

// ----------------------------------------------------------------------------------

function ajax(method,url,params,callback,scope) {
	var scope = (scope==undefined | !scope) ? window : scope;
	var xmlhttp = new XMLHttpRequest();
	var async = (callback!=undefined && !!callback);
	if (async) {
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				callback.apply(scope,[ajax_trim(xmlhttp.responseText)]);
			}
		}
	}
	if (method=="POST") {
		xmlhttp.open("POST", url, async);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//		xmlhttp.setRequestHeader("Content-length", params.length);
//		xmlhttp.setRequestHeader("Connection", "close");
		xmlhttp.send(params);
	} else {
		xmlhttp.open("GET",url+"?"+params,async);
		xmlhttp.send();
	}
	return ajax_trim(xmlhttp.responseText);
}




// ----------------------------------------------------------------------------------------
// USEFUL JSON/OBJECT MANIPULATION FUNCTIONS
// http://www.sitepoint.com/javascript-json-serialization/#.T_HibfWWjbg
// ----------------------------------------------------------------------------------------

var JSON = JSON || {};

//// implement JSON.stringify serialization  
//JSON.stringify = JSON.stringify || function (obj) {  
JSON.stringify = function (obj) {  
	var t = typeof (obj);  
	if (t != "object" || obj === null) {  
		// simple data type  
		if (t == "string") obj = '"'+obj+'"';  
		return String(obj);  
	}  
	else {  
		// recurse array or object  
		var n, v, json = [], arr = (obj && obj.constructor == Array);  
		for (n in obj) {  
			v = obj[n]; t = typeof(v);  
			if (t == "string") v = '"'+v+'"';  
			else if (t == "object" && v !== null) v = JSON.stringify(v);  
			json.push((arr ? "" : '"' + n + '":') + String(v));  
		}  
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");  
	}  
};  

// implement JSON.parse de-serialization  
JSON.parse = JSON.parse || function (str) {  
	if (str === "") str = '""';  
	eval("var p=" + str + ";");  
	return p;  
};  


// --------------------------------------------
// Added by jetweedy
// --------------------------------------------
JSON.clone = function(json, proto) {
	var r = JSON.parse(json);
	if (!proto) { proto = false; } else {
		for (var i in proto) {
			r[i] = proto[i];
		}
	}
	return r;
}

// ----------------------------------------------------------------------------------------





//*******************************************************************
// Ajax get call
//*******************************************************************
function ajaxGet(aURL, aLoadingDone, aCustomData) {
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
					aLoadingDone( data, aCustomData);
			}
	}
	self.xmlHttpReq.open('GET', aURL, true);
	self.xmlHttpReq.send(null);
}
 
 
 
//*******************************************************************
// Ajax post call
//*******************************************************************
function ajaxPost( aURL, aLoadingDone, aPostData, aCustomData ) {
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
					aLoadingDone( data, aCustomData);
			}
	}
	
	// assemble post data from passed aPostData object
	var postData = '';
	for (var field in aPostData ) {
		if (postData !='') {
			postData += '&';
		}
		postData += (''+field) + '=' + encodeURIComponent( aPostData[field] );
	}
	
	self.xmlHttpReq.open('POST', aURL, true);
  self.xmlHttpReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	self.xmlHttpReq.send( postData );
}