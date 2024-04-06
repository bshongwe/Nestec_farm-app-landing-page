#!/usr/bin/node

// IIFE start
(function($) {
  'use strict'; // Enabling strict mode
  
  // Initializing Dropzone plugin for the element with id 'my-awesome-dropzone'
  $("my-awesome-dropzone").dropzone({
    url: "bootstrapdash.com/" // Setting the URL for file uploads
  });
})(jQuery); // End of IIFE, passing jQuery as parameter
