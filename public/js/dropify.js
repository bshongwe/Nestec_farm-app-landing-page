#!/usr/bin/node

// IIFE start
(function($) {
  'use strict'; // Enabling strict mode
  
  // Initializing Dropify plugin for elements with class 'dropify'
  $('.dropify').dropify();
})(jQuery); // End of IIFE, passing jQuery as parameter