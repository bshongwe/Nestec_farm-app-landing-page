#!/usr/bin/node

// Start of the self-executing anonymous function
(function($) {
  'use strict';

  // Wait for DOM to be fully loaded
  $(function() {
    // Initialize DataTable on element with id 'order-listing'
    $('#order-listing').DataTable({
      // Define length menu options
      "aLengthMenu": [
        [5, 10, 15, -1], // Array of options for items per page
        [5, 10, 15, "All"] // Array of labels for items per page options
      ],
      // Set initial display length
      "iDisplayLength": 10,
      // Customize language settings
      "language": {
        search: "" // Remove default search text
      }
    });

    // For each DataTable instance with id 'order-listing'
    $('#order-listing').each(function() {
      var datatable = $(this);

      // SEARCH - Add placeholder for Search and Turn this into in-line form control
      // Find search input field
      var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
      // Set placeholder text for search input
      search_input.attr('placeholder', 'Search');
      // Remove 'form-control-sm' class to make search input inline
      // search_input.removeClass('form-control-sm');

      // LENGTH - Inline-Form control
      // Find length selection dropdown
      var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
      // Remove 'form-control-sm' class to make the length selection dropdown inline
      // length_sel.removeClass('form-control-sm');
    });
  });
})(jQuery);
