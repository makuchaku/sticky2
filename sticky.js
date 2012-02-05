/*
	Sticky2 - by makuchaku (maku@makuchaku.in)


	Sticky v1.0 by Daniel Raftery
	http://thrivingkings.com/sticky

	http://twitter.com/ThrivingKings
*/
(function ($) {

  // Using it without an object
  $.sticky = function (note, options, callback) {
    return $.fn.sticky(note, options, callback);
  };


	/*  
		if noteData is an object, we need to construct the note from noteTemplate - else, just use it as it is.
		noteData => {
			image : "http://foo/path.png",
			text : "Note's text",
			title : "Note's title",
			link : "http://google.com"
		}
		options => {
	  	speed : "fast", // or any other jquery speed definition
	  	duplicates : true, // boolean
	  	autoclose : 5000, // milisec after the sticky autocloses, or false
	  	position : "top-right" // top-left, top-right, bottom-left or bottom-right
	  }
	  callback => function, called when sticky is shown. Args =>  {'id': uniqID, 'duplicate': duplicate, 'displayed': display, 'position': position} 
  */
  $.fn.sticky = function (noteData, options, callback) {
    // Default settings
    var settings = {
      'speed': 'fast', 			// animations: fast, slow, or integer
      'duplicates': true, 	// true or false
      'autoclose': 5000, 		// integer or false
      'position' : "top-right"	// top-left, top-right, bottom-left, or bottom-right
    };
    options = $.extend(settings, options); // inject the defaults into options

    var position = options.position;
    var closeImageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAA1klEQVQoz6WSOw6CQBCG90gWXsjKxph4HZAEsgUSHlsAAa6ilzDGgopxP5Ix2K7FJH/+x+wMjBERoxXH8d5aey2K4l6W5ZMCw6FtvV+Qpumlrut313UyDIOM47gWGA4Nz08QomkaadtW+r5fA9M0rQWGQ8OjYRNF0c53mxH8aLc8z8/OuYWXKDAcGh68ZAzzMwpdveFEtyzLDt6AScBwaHjwkjF++cem+6zGJEmOlDZCUx8ZU1XVS3eC9K8sGtAGcGi6M5nwYPCowR8n+HcEH8BfJxdy5B8L5i9vzgm5WAAAAABJRU5ErkJggg==";

    // Note template
    var noteTemplate = '\
	    <div class="sticky2-message-container">\
	      <div class="sticky2-message-image-container">\
	        <img src="__IMAGE__"/>\
	      </div>\
	      <div class="sticky2-message-text-container">\
	        <div class="sticky2-message-title">__TITLE__</div>\
	        <div class="sticky2-message-text">__TEXT__</div>\
	      </div>\
	    </div>\
    ';


    // if noteData is an object, we need to construct the note from noteTemplate
    // else, just use it as it is.
    if(typeof(noteData) == typeof(""))
    	note = noteData;
    else
    {
	    // construct the note from note template & input data
	    var note = noteTemplate
	    	.replace("__IMAGE__", noteData.image)
	    	.replace("__TITLE__", noteData.title)
	    	.replace("__TEXT__", noteData.text);
    }


    // Passing in the object instead of specifying a note
    if (!note)
      note = this.html();


    if (options)
      $.extend(settings, options);


    // Variables
    var display = true;
    var duplicate = 'no';

    // Somewhat of a unique ID
    var uniqID = Math.floor(Math.random() * 99999);

    // Handling duplicate notes and IDs
    $('.sticky-note').each(function () {
      if ($(this).html() == note && $(this).is(':visible'))
      {
        duplicate = 'yes';
        if (!settings['duplicates'])
        {
          display = false;
        }
      }

      if ($(this).attr('id') == uniqID)
        uniqID = Math.floor(Math.random() * 9999999);

    });

    // Make sure the sticky queue exists
    if (!$('body').find('.sticky-queue').html())
      $('body').append('<div class="sticky-queue ' + position + '"></div>');


    // Can it be displayed?
    if (display)
    {
      // Building and inserting sticky note
      $('.sticky-queue').prepend('<div class="sticky border-' + position + '" id="' + uniqID + '"></div>');
      $('#' + uniqID)
      	.append('<img src="' + closeImageData + '" class="sticky-close" rel="' + uniqID + '" title="Close" />')
      	.append('<div class="sticky-note" rel="' + uniqID + '">' + note + '</div>');
      

      if(noteData && typeof(noteData.link) == typeof(""))
      {
	      $("#" + uniqID + " .sticky-note")
	      	.css({cursor : "pointer"})
	      	.click(function() {
	    			window.open(noteData.link);
	      	});
      }

      // Smoother animation
      var height = $('#' + uniqID).height();
      $('#' + uniqID).css('height', height);

      $('#' + uniqID).slideDown(settings['speed']);
      display = true;
    }

    // Listeners
    $('.sticky').ready(function () {
      // If 'autoclose' is enabled, set a timer to close the sticky
      if (settings['autoclose'])
        $('#' + uniqID).delay(settings['autoclose']).slideUp(settings['speed'], function() {
	        $(this).remove(); // remove the note from dom
	      });
    });

    // Closing a sticky
    $('.sticky-close').click(function () {
      $('#' + $(this).attr('rel')).dequeue().slideUp(settings['speed'], function() {
        $(this).remove();	// remove the note from dom
      });
    });


    // Callback data
    var response = {
      'id': uniqID,
      'duplicate': duplicate,
      'displayed': display,
      'position': position
    }

    // Callback function?
    if (callback)
      callback(response);
    else
      return (response);
    
  } // $.fn.sticky

})(jQuery);