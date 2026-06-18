
// ---------------------------------------------------------
// Handle subforms
// ---------------------------------------------------------

var SUBFORMS = {};

var SUBFORMTEMPLATES = [];

function subform_updateSelectValues() {
	var selects = document.getElementsByClassName('selectwvalue');
	for (var s in selects) {
	//  selects[s].value = selects[s].value;
	  var options = selects[s].options;
	  for (var o in options) {
	    var oval = (options[o].value+"");
	    var sval = (selects[s].getAttribute('_value')+"");
	    if ( oval == sval ) {
	      options[o].selected = true;
	    }
	  }
	}
}

function subform_updateDateInputs() {
	var dateinputs = document.getElementsByClassName("dateinput");
	for (var di in dateinputs) {
		if (dateinputs[di].tagName=="INPUT") {
			if (!cssHasClass(dateinputs[di], "ignore")) {
				cssAddClass(dateinputs[di], "ignore");
//				cssRemoveClass(dateinputs[di], "dateinput");
				var newinput = dateinputs[di].cloneNode(true);
				var newparent = dateinputs[di].parentNode;
				newparent.innerHTML = "";
				newparent.appendChild(newinput);
				new DrillDownDateDropDown( newinput, { DefaultDecade:0, DateFormat: "fullDate" } );
			}
		}
	}
}

function deleteSubFormRow(x) {
	var x = document.getElementById(x);
	console.log("x", x);
//	if (confirm("Are you sure you want to remove this row?")) {
		x.parentNode.removeChild(x);
//	}
}

function addSubFormRow(e) {
	e.preventDefault();
	var containerID = this._container;
	var group = this._group;
	SUBFORMS[group].num++;
	var tr = document.createElement("tr");
	var rid = group+"_row_"+SUBFORMS[group].num;
	tr.id = rid;
	var td = document.createElement("td");
	td.innerHTML = "<a href=\"javascript:deleteSubFormRow('"+rid+"');\">[X]</a>";
	tr.appendChild(td);
	var template = document.getElementById(SUBFORMTEMPLATES[group]).innerHTML;

	template = template.replace(/dateinput ignore/g, "dateinput");
	template = template.replace(/name=\"(.*?)\"/g, "name=\"subform_"+group+"_"+SUBFORMS[group].num+"_$1\"");

	tr.innerHTML += template;
	var parser = new DOMParser();
	var templateDom = parser.parseFromString("<table><tr>"+tr.innerHTML+"</tr></table>", "text/html");

	var temprow = templateDom.body.getElementsByTagName("tr")[0].cloneNode(true);
	tr.innerHTML = "";
	for (var td=0; td<temprow.childNodes.length; td++) {
		if (temprow.childNodes[td].tagName=="TD") {
			tr.appendChild(temprow.childNodes[td]);
		}
	}
	document.getElementById(containerID).appendChild(tr);
	subform_updateDateInputs();
}



// ----------------------------------------------------------------------------------------------------

function itemFormSubmit(doWhatAfterSave) {
	doWhatAfterSave = !doWhatAfterSave ? "save" : doWhatAfterSave;
	document.getElementById('doWhatAfterSave').value = doWhatAfterSave;
	document.getElementById('form_edittrackitem').submit();
}

var showItemDataHistoryOption = true;

var ulFormSubmit = function() {
	try {
		var thisdoc = document.getElementById('track-item-files').contentWindow.document;
		var filename = thisdoc.getElementById('uFile').value;
		var ispublic = thisdoc.getElementById('cb_ispublic').checked ? 1 : 0;
		var item_id = thisdoc.getElementById('item_id').value;
		var filename = filename.replace(/^.*[\\\/]/, '');
		var p = "action=checkFileName&filename="+escape(filename)+"&item_id="+item_id;
		var aj = ajax("post","tracking-item-file-ajax.php",p);
		var file_id = parseInt(aj);
//		alert(p + "\n\n" + file_id + "\n\n" + aj);
		if (file_id > 0) {
			var funSubmit = function() {
				thisdoc.getElementById('file-upload').submit();
				this.hide();
			}
			var funCancel = function() {
				document.getElementById('track-item-files').contentWindow.ufShowUploadForm.apply(this);
			}
			var html = "";
			html += "File " + filename + " already exists. Overwrite it?";
			html += "<div style='clear:both;'></div>";
			var dialogSubmit = new ciphrDialog("Overwrite File?", html, "width:auto;", false, false, jsCurry(funCancel, false, []) );
			var btnSubmit = dialogSubmit.createButton("btn-eRequest-overwrite.png", "Overwrite", jsCurry(funSubmit,dialogSubmit,[]), "button");
			dialogSubmit.ContentNode.appendChild(btnSubmit.Element);
			dialogSubmit.init();
		}
		else {
			thisdoc.getElementById('file-upload').submit();
		}
	} catch(er) { alert(er); alertObjectProperties(er); }
	return false;
}

var ufFinishDeletingFile = function(file_id,dialogDelete) {
	dialogDelete.hide();
	var aj = ajax("get","tracking-item-file-ajax.php","action=deleteFile&file_id="+file_id);
	document.getElementById('track-item-files').contentWindow.ufShowUploadedFiles.apply(this,[document.getElementById('ITEM_ID').value, document.getElementById('uList')]);
}

var ufDeleteFile = function(file_id) {
		var html = "";
		html += "Are you sure you want to delete this file?";
		html += "<div style='clear:both;'></div>";
		var dialogDelete = new ciphrDialog("Delete File", html, "width:auto;", false, false, false);
		funDelete = jsCurry(ufFinishDeletingFile, this, [file_id,dialogDelete]);
		var btnDelete = dialogDelete.createButton("btn-shred.png", "Permanently Delete Item", funDelete, "button");
		dialogDelete.ContentNode.appendChild(btnDelete.Element);
		dialogDelete.init();
}

// ----------------------------------------------------------------------------------------------------
