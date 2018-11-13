//Enroll button
//Fet group function
var g_faceId;
var g_personId;
var timeOut = null;

//All tag use in this script
//<select id="rec_mode">
//</select>
//<input type="text" id="inputName"/><br>
//<input type="text" id="testInput" onkeyup="waitInput()"><br>
//Student Image: <input type="text" name="inputImage" id="inputImage" />
function waitInput() {
    clearTimeout(timeOut);
	var textInput = document.getElementById('testInput');
    // Make a new timeout set to go off in 800ms
    timeOut = setTimeout(function () {
        console.log('Input Value:', textInput.value);
		//alert("hello");
    }, 2000);
};

function getGroupData() {
	var params = {
		// Request parameters
		"start": "",
		"top": "1000",
	};

	$.ajax({
		url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups?" + $.param(params),
		beforeSend: function(xhrObj){
			// Request headers
			xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a8c95726a4db4c4388cf55ac071a5903");
		},
		type: "GET",
		// Request body
		data: "",
	})
	.done(function(data) {
		// Show formatted JSON on webpage.
		$("#responseTextArea").val(JSON.stringify(data, null, 2));
		testOption(data);
		//testOption(JSON.stringify(data, null,2));
	})

	.fail(function(jqXHR, textStatus, errorThrown) {
		// Display error message.
		var errorString = (errorThrown === "") ?
			"Error. " : errorThrown + " (" + jqXHR.status + "): ";
		errorString += (jqXHR.responseText === "") ?
			"" : (jQuery.parseJSON(jqXHR.responseText).message) ?
				jQuery.parseJSON(jqXHR.responseText).message :
					jQuery.parseJSON(jqXHR.responseText).error.message;
		alert(errorString);
	});
};


//Put group data into <select> tag
function testOption(groupData){
	var selectBox = document.getElementById("rec_mode");
	console.log(groupData.length);
	console.log(typeof(groupData));
	for (var i=0, l = groupData.length; i<l; i++){
		var op = document.createElement("OPTION"),
			txt = document.createTextNode(groupData[i].name);
		op.appendChild(txt);
		op.setAttribute("value",groupData[i].personGroupId);
		//selectBox.insertBefore(op,selectBox.lastChild);
		selectBox.appendChild(op);
	}
	alert("finish");
};

//Detect Face
function detectImage(data) {
        // Replace <Subscription Key> with your valid subscription key.
        var subscriptionKey = "a8c95726a4db4c4388cf55ac071a5903";
        var uriBase =
            "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "true"
        };

        // Display the image.
        var sourceImageUrl = document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;

        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",

            // Request body.
            data: '{"url": ' + '"' + sourceImageUrl + '"}',
        })

        .done(function(data) {
            // return faceId
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
			checkNumFace(data);
        })

        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ?
                "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ?
                "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message :
                        jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
	return data;
};

function checkNumFace(data){
	if(data.length > 1){
		alert("Error more than one face");
	}
	else{
		//alert(data[0].faceId);
		g_faceId = data[0].faceId;
		createPerson();
	}
};

//create person if only one face in picture
function createPerson() {
	var select_tag = document.getElementById("rec_mode");
	var personGroupId = select_tag.options[select_tag.selectedIndex].value;
	console.log(personGroupId);
	var params = {
	   "personGroupId": personGroupId
	};
	//var group = "santitestgroup"
	var sourceName = document.getElementById("inputName").value;
	$.ajax({
		url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons?" + $.param(params),
		beforeSend: function(xhrObj){
			// Request headers
			xhrObj.setRequestHeader("Content-Type","application/json");
			xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a8c95726a4db4c4388cf55ac071a5903");
		},
		type: "POST",
		// Request body
		data: '{"name": "'+sourceName+'" }',
	})
	.done(function(data) {
		// Show formatted JSON on webpage.
		$("#responseTextArea").val(JSON.stringify(data, null, 2));
		g_personId = data.personId;
		console.log('personId: ',g_personId);
		processAddFace();
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		// Display error message.
		var errorString = (errorThrown === "") ?
			"Error. " : errorThrown + " (" + jqXHR.status + "): ";
		errorString += (jqXHR.responseText === "") ?
			"" : (jQuery.parseJSON(jqXHR.responseText).message) ?
				jQuery.parseJSON(jqXHR.responseText).message :
					jQuery.parseJSON(jqXHR.responseText).error.message;
		alert(errorString);
	});
};

//add face after create person
function processAddFace() {
	var select_tag = document.getElementById("rec_mode");
	var personGroupId = select_tag.options[select_tag.selectedIndex].value;
	var params = {
		// Request parameters
		"personGroupId": personGroupId,
		"personId": g_personId,
	};
	// Display the image.
	var sourceImageUrl = document.getElementById("inputImage").value;
	document.querySelector("#sourceImage").src = sourceImageUrl;

	$.ajax({
		url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons/{personId}/persistedFaces?" + $.param(params),
		beforeSend: function(xhrObj){
			// Request headers
			xhrObj.setRequestHeader("Content-Type","application/json");
			xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a8c95726a4db4c4388cf55ac071a5903");
		},
		type: "POST",
		// Request body
		data: '{"url":' + '"' + sourceImageUrl + '"}',
	})
	.done(function(data) {
		// Show formatted JSON on webpage.
		$("#responseTextArea").val(JSON.stringify(data, null, 2));
		console.log('persistedFaceId: ',data.persistedFaceId);
		trainGroup();
	})

	.fail(function(jqXHR, textStatus, errorThrown) {
		// Display error message.
		var errorString = (errorThrown === "") ?
			"Error. " : errorThrown + " (" + jqXHR.status + "): ";
		errorString += (jqXHR.responseText === "") ?
			"" : (jQuery.parseJSON(jqXHR.responseText).message) ?
				jQuery.parseJSON(jqXHR.responseText).message :
					jQuery.parseJSON(jqXHR.responseText).error.message;
		alert(errorString);
	});
};

//train group after add face to person
function trainGroup() {
	var select_tag = document.getElementById("rec_mode");
	var personGroupId = select_tag.options[select_tag.selectedIndex].value;
	var params = {
	   "personGroupId": personGroupId,
	};

	$.ajax({
		url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/train?" + $.param(params),
		beforeSend: function(xhrObj){
			// Request headers
			xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a8c95726a4db4c4388cf55ac071a5903");
		},
		type: "POST",
		// Request body
		data: "",
	})
	.done(function(data) {
		// Show formatted JSON on webpage.
		$("#responseTextArea").val(JSON.stringify(data, null, 2));
		getTrainStatus();
	})

	.fail(function(jqXHR, textStatus, errorThrown) {
		// Display error message.
		var errorString = (errorThrown === "") ?
			"Error. " : errorThrown + " (" + jqXHR.status + "): ";
		errorString += (jqXHR.responseText === "") ?
			"" : (jQuery.parseJSON(jqXHR.responseText).message) ?
				jQuery.parseJSON(jqXHR.responseText).message :
					jQuery.parseJSON(jqXHR.responseText).error.message;
		alert(errorString);
	});
};

//show train status after train
function getTrainStatus() {
	var select_tag = document.getElementById("rec_mode");
	var personGroupId = select_tag.options[select_tag.selectedIndex].value;
	var params = {
		"personGroupId": personGroupId
	};

	$.ajax({
		url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/training?" + $.param(params),
		beforeSend: function(xhrObj){
			// Request headers
			xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a8c95726a4db4c4388cf55ac071a5903");
		},
		type: "GET",
		// Request body
		data: "{body}",
	})
	.done(function(data) {
		// Show formatted JSON on webpage.
		$("#responseTextArea").val(JSON.stringify(data, null, 2));
	})

	.fail(function(jqXHR, textStatus, errorThrown) {
		// Display error message.
		var errorString = (errorThrown === "") ?
			"Error. " : errorThrown + " (" + jqXHR.status + "): ";
		errorString += (jqXHR.responseText === "") ?
			"" : (jQuery.parseJSON(jqXHR.responseText).message) ?
				jQuery.parseJSON(jqXHR.responseText).message :
					jQuery.parseJSON(jqXHR.responseText).error.message;
		alert(errorString);
	});
};
function enrollFace(){
	//temporary faceId
	detectImage();
	//alert(g_faceId);
//	if(stu_faceId == error){
//		alert("error try again");
//	}
//	createPerson(groupId, stu_name, stu_faceId);
//	trainFace();
//	if(trainFace() success){
//		alert("finish");
//	}
//	else{
//		alert("Error");
//	}
};