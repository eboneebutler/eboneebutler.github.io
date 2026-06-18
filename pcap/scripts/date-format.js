var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,

  timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,

  timezoneClip = /[^-+\dA-Z]/g,
	
	pad = function (val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) val = "0" + val;
		return val;
	};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

var tempi = 0;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) return '';

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	paddedDate:     "mm/dd/yyyy",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	mysqlDateTime:    "yyyy-mm-dd HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// Add the functions to the date javascript object
Date.prototype.format = function (mask, utc) {
	var r = dateFormat(this, mask, utc);
	return r;
};

// Setup a method to convert MySql date strings
Date.prototype.setMySQLDateTime = function (aMySQLDateTimeString) {
	var regex = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
	var parts = aMySQLDateTimeString.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');	
	if (parts.length==6) {
		var newDate = new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
		this.setTime( newDate.getTime());
	}
};


// Setup a method to convert MySql date strings
Date.prototype.setMySQLDate = function (aMySQLDateString) {
	var regex = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])?$/;
	var parts = aMySQLDateString.replace(regex,"$1 $2 $3").split(' ');	
	var newDate = new Date(parts[0],parts[1]-1,parts[2]);
	this.setTime( newDate.getTime());


};

// Check if the date is valid
Date.prototype.isValid = function () {
  if ( Object.prototype.toString.call(this) !== "[object Date]" )
    return false;
  return !isNaN(this.getTime());
}

function dbStringToDate(str)
{
	try
	{
//		str = "2011-10-31 13:11:26";
		str = str+"";
		if (str.length>18)
		{
			var r = "";
			yyyy = str.substring(0,4);
			mm = str.substring(5,7);
			dd = str.substring(8,10);
			H = parseInt(str.substring(11,13));
			M = parseInt(str.substring(14,16));
			ampm = "AM";
			r = mm+"/"+dd+"/"+yyyy;
			if (H > 12)
			{
				var H = H - 12;
				var ampm = "PM";
			}
			if (H < 1)
			{
				H = "12";
			}
			if (H!=0 && M!=0)
			{
				var HH = H;
				var MM = leadDigits(M,2);
				r += " " + HH + ":" + MM + " " + ampm;
			}
			return r;
		}
	}
	catch(er) { return str; }
}

function strtodate(str) {
// return date object
   
    if (str.length == 5) {
        hr = str.substring(0,2);
        min = str.substring(2,4);
        ap = str.charAt(4);
    }
    else if (str.length == 8) {
        hr = str.substring(0,2);
        min = str.substring(3,5);
        ap = str.charAt(6);
    }
    else {
        alert("Please enter time as 5 digits or as HH:MM AM");
        hr = '00';
        min = '00';
        ap = 'a';
    }
    
    if (hr == 12 && (ap != 't' || ap != 'T')) {
        hr = Number(hr) - 12;
    }
    if (ap == 'p' || ap == 'P') {
        hr = Number(hr) + 12;
    }
    
    
    date = new Date(); // will need to change this later to be correct date, now it is set to the current date
    date.setHours(hr);
    date.setMinutes(min);
    return date;
}

function datechange(obj, event) {
    // obj is 'this'
    // once 5th char is entered then look for : in string.  if found then nothing.  if not found
    // then transform string into date object using strtodate(obj.value)
    // need to add a bit if the user presses a key other than the 4 below
    // a==97, A ==65, p==112, P==80, 84 == t
    if(!event) {event = window.event;}
    var key = event.keyCode;
    //alert(key);
    if (key == 65 || key == 80 || key == 84) {
        
        if (obj.value.length == 5) {
            // check for ':', then transform if not found.
            var test = obj.value.indexOf(':');
            if (test == -1) {
                // did not find ':'
                var date = strtodate(obj.value);
               
                hrs = date.getHours();
                min = date.getMinutes();
                
                suffix = "AM";
                if (hrs >= 12) {
                    hrs = hrs - 12;
                    suffix = "PM";
                }
                if (hrs == 0) {
                    hrs = 12;
                }
                if (parseInt(hrs) < 10) {
                    hrs = "0" + hrs;
                }
                if (parseInt(min) < 10) {
                    min = "0" + min;
                }
                var str = hrs + ":" + min + " " + suffix;
                obj.value = str;
                
                gotonext(obj);
            }
        }
    }
    else if (key > 95 && key < 106) {
        // if key is not from numpad
    }
    else if (key > 47 && key < 60) {
            // if key is not from number keys
    }
    else if (key == 16 || key == 32 || key == 77 || key == 9 || key == 8 || key == 46 || key == 37 || key == 39) {
                // if key is not shift, space, M, tab, backspace, delete, left arrow, or right arrow
    }
    else {
//        alert("Please enter time as 5 digits or as HH:MM AM.");
        //alert(key);
    }
    
}