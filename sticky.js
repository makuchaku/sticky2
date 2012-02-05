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
	  	position : "top-right", // top-left, top-right, bottom-left or bottom-right
      social : true // or false. Will always be false if noteData.link is not available
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
        <div style="clear:both;"></div>\
        <div class="sticky2-message-social">\
          <div class="sticky2-message-social-facebook"><div>__FACEBOOK__</div></div>\
          <div class="sticky2-message-social-google"><div>__GOOGLE__</div></div>\
          <div class="sticky2-message-social-twitter"><div>__TWITTER__</div></div>\
        </div>\
	    </div>\
    ';

    // identifies if we need to load JS for social plugins
    var socialJsLoaded = false;

    var socialTemplates = {
      facebook : '<iframe src="//www.facebook.com/plugins/like.php?href=__LINK__&amp;send=false&amp;layout=button_count&amp;width=100&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21&amp;appId=300106583504" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:21px;" allowTransparency="true"></iframe>',
      google : '<div class="g-plusone" data-size="medium" data-href="__LINK__"></div>',
      twitter : '<a href="https://twitter.com/share" class="twitter-share-button" data-url="__LINK__" data-count="none" data-via="FireFollow" data-hashtags="FireFollow">Tweet</a>'
    };


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

      // Prepare social plugins
      var socialPluginsHtml = {
        facebook : socialTemplates.facebook.replace("__LINK__", noteData.link),
        google : socialTemplates.google.replace("__LINK__", noteData.link),
        twitter : socialTemplates.twitter.replace("__LINK__", noteData.link)
      };

      // Inject social plugins
      note = note
        .replace("__FACEBOOK__", socialPluginsHtml.facebook)
        .replace("__GOOGLE__", socialPluginsHtml.google)
        .replace("__TWITTER__", socialPluginsHtml.twitter);

      // Load required social scripts
      loadSocialJs();
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


    function loadSocialJs() {
      if(socialJsLoaded == true)
        return;

      socialJsLoaded = true;

      // Google
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/plusone.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);

      // Twitter
      !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");      
    }
    
  } // $.fn.sticky

})(jQuery);