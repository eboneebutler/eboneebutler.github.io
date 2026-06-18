
function itemNavFormSubmit(validate) {
	var overlay = document.getElementById('overlay');
	overlay.style.display='block';
	try {
		var docHeight = Math.max(
					document.body.scrollHeight, document.documentElement.scrollHeight,
					document.body.offsetHeight, document.documentElement.offsetHeight,
					document.body.clientHeight, document.documentElement.clientHeight
			); // http://james.padolsey.com/javascript/get-document-height-cross-browser/
		overlay.style.top = (docHeight-overlay.offsetHeight) + "px";
	} catch(er) {}
	document.getElementById('_validate').value = validate;
	setTimeout(function() {
//			alert(validate);
		document.getElementById('form_edittrackitem').submit();
	}, 100);
}


