#!/usr/bin/node

// Start of the self-executing anonymous function
(function($) {
  'use strict';

  // Check if an element with class 'circle-progress-1' exists
  if ($(".circle-progress-1").length) {

    // Initialize Circle Progress plugin with some basic options
    $('.circle-progress-1').circleProgress({
      // Set options for the progress bar
      startAngle: -Math.PI / 2, // Start angle (top position)
      size: 150, // Size of the circle
      lineCap: 'round', // Shape of the progress bar's line ends
      fill: {color: "#ff6e40"}, // Fill color of the progress bar
      emptyFill: "#f2f2f2", // Fill color of the remaining part of the circle
      thickness: 10 // Thickness of the progress bar
    }).on('circle-animation-progress', function(event, progress, stepValue) {

      // Update the value inside the progress circle
      $(this).find('.value').html(Math.round(100 * stepValue.toFixed(2).substr(1)) + '<i>%</i>');
    });
  }
})(jQuery);
