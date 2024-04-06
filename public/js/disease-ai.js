#!/usr/bin/node

// Execute code when the DOM is fully loaded
$(function() {
	// Retrieve default values from local storage
	retrieveDefaultValuesFromLocalStorage();
	// Setup event listeners for buttons
	setupButtonListeners();
});

// Inference function
var infer = function() {
	$('#output').html("Inferring...");
	$("#resultContainer").show();
	$('html').scrollTop(100000);

	// GET: form settings
	getSettingsFromForm(function(settings) {
		// Error handling
		settings.error = function(xhr) {
			$('#output').html("").append([
				"Error loading response.",
				"",
				"Check your API key, model, version,",
				"and other parameters",
				"then try again."
			].join("\n"));
		};

		// AJAX request
		$.ajax(settings).then(function(response) {
			// Handling response based on format
			if(settings.format == "json") {
				// Formatting JSON response
				var pretty = $('<pre>');
				var formatted = JSON.stringify(response, null, 4)

				pretty.html(formatted);
				$('#output').html("").append(pretty);
				$('html').scrollTop(100000);
			} else {
				// Displaying image response
				var arrayBufferView = new Uint8Array(response);
				var blob = new Blob([arrayBufferView], {
					'type': 'image\/jpeg'
				});
				var base64image = window.URL.createObjectURL(blob);

				var img = $('<img/>');
				img.get(0).onload = function() {
					$('html').scrollTop(100000);
				};
				img.attr('src', base64image);
				$('#output').html("").append(img);
			}
		});
	});
};

// Function to retrieve default values from local storage
var retrieveDefaultValuesFromLocalStorage = function() {
	try {
		var api_key = localStorage.getItem("rf.api_key");
		var model = localStorage.getItem("rf.model");
		var format = localStorage.getItem("rf.format");

		// Set values from local storage to corresponding form elements
		if (api_key) $('#api_key').val(api_key);
		if (model) $('#model').val(model);
		if (format) $('#format').val(format);
	} catch (e) {
		// localStorage disabled
	}

	// Event listeners for form elements to update local storage
	// #1. for Model
	$('#model').change(function() {
		localStorage.setItem('rf.model', $(this).val());
	});

	// #2. for API key
	$('#api_key').change(function() {
		localStorage.setItem('rf.api_key', $(this).val());
	});

	// #3. for Format
	$('#format').change(function() {
		localStorage.setItem('rf.format', $(this).val());
	});
};

// Setup event listeners for buttons
var setupButtonListeners = function() {
	// run inference when the form is submitted
	$('#inputForm').submit(function() {
		infer();
		return false;
	});

	// UI changes
	// make the buttons blue when clicked
	// and show the proper "Select file" or "Enter url" state
	$('.bttn').click(function() {
		$(this).parent().find('.bttn').removeClass('active');
		$(this).addClass('active');

		// Show appropriate container based on button clicked
		if($('#computerButton').hasClass('active')) {
			$('#fileSelectionContainer').show();
			$('#urlContainer').hide();
		} else {
			$('#fileSelectionContainer').hide();
			$('#urlContainer').show();
		}

		// Show or hide image options based on button clicked
		if($('#jsonButton').hasClass('active')) {
			$('#imageOptions').hide();
		} else {
			$('#imageOptions').show();
		}

		return false;
	});

	// wire styled button to hidden file input
	$('#fileMock').click(function() {
		$('#file').click();
	});

	// grab the filename when a file is selected
	$("#file").change(function() {
		var path = $(this).val().replace(/\\/g, "/");
		var parts = path.split("/");
		var filename = parts.pop();
		$('#fileName').val(filename);
	});
};

// GET: settings from form
var getSettingsFromForm = function(cb) {
	var settings = {
		method: "POST",
	};

	var parts = [
		"https://detect.roboflow.com/",
		$('#model').val(),
		"/",
		$('#version').val(),
		"?api_key=" + $('#api_key').val()
	];

	var classes = $('#classes').val();
	if(classes) parts.push("&classes=" + classes);

	var confidence = $('#confidence').val();
	if(confidence) parts.push("&confidence=" + confidence);

	var overlap = $('#overlap').val();
	if(overlap) parts.push("&overlap=" + overlap);

	var format = $('#format .active').attr('data-value');
	parts.push("&format=" + format);
	settings.format = format;

	// Handling image format settings
	if(format == "image") {
		var labels = $('#labels .active').attr('data-value');
		if(labels) parts.push("&labels=on");

		var stroke = $('#stroke .active').attr('data-value');
		if(stroke) parts.push("&stroke=" + stroke);

		settings.xhr = function() {
			var override = new XMLHttpRequest();
			override.responseType = 'arraybuffer';
			return override;
		}
	}

	var method = $('#method .active').attr('data-value');
	if(method == "upload") {
		var file = $('#file').get(0).files && $('#file').get(0).files.item(0);
		if(!file) return alert("Please select a file.");

		// Get base64 data from file and create settings object
		getBase64fromFile(file).then(function(base64image) {
			settings.url = parts.join("");
			settings.data = base64image;

			console.log(settings);
			cb(settings);
		});
	} else {
		var url = $('#url').val();
		if(!url) return alert("Please enter an image URL");

		parts.push("&image=" + encodeURIComponent(url));

		settings.url = parts.join("");
		console.log(settings);
		cb(settings);
	}
};

// GET: base64 data from file
var getBase64fromFile = function(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            resolve(reader.result);
        };
        reader.onerror = function(error) {
            reject(error);
        };
    });
};

// Resize image
var resizeImage = function(base64Str) {
	return new Promise(function(resolve, reject) {
		var img = new Image();
		img.src = base64Str;
		img.onload = function(){
			var canvas = document.createElement("canvas");
			var MAX_WIDTH = 1500;
			var MAX_HEIGHT = 1500;
			var width = img.width;
			var height = img.height;
			if (width > height) {
				if (width > MAX_WIDTH) {
					height *= MAX_WIDTH / width;
					width = MAX_WIDTH;
				}
			} else {
				if (height > MAX_HEIGHT) {
					width *= MAX_HEIGHT / height;
					height = MAX_HEIGHT;
				}
			}
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, width, height);
			resolve(canvas.toDataURL('image/jpeg', 1.0));  
		};
    
	});	
};
