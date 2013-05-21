/* Soundcloud API init settings */
SC.initialize({
 	client_id: "c216cd77bacee37526ece4451c3d678e",
	redirect_uri: 'http://www.marie-anne-sinfreu.fr/SC-challenge/soundcloud.html'
});

var songslist = [];
var totalsong = 0;

$(document).ready(function() {

	/* connect to SC to get the user playlist */
	$('a#_connect').click(function(e) {
		e.preventDefault();
		SC.connect(function() {
			
			/* get the user info (username and number of public tracks) and display them in the webpage */				
			SC.get('/me', function(me) {
				$('.sc-logoff').hide();
				$('#_username').html('<h2>Welcome<br />' + me.username + '!</h2>');
				$('#_userimg').html('<img src="' + me.avatar_url + '" />');
				$('#_maincontent').show();
			});

			/* get all the tracks by the connected user */
			SC.get('/me/tracks', function(tracks) {
				
				/* read all the tracks in a loop to display them on a list in the webpage */
				$(tracks).each(function(index, track) {
					
					/* count how many track there is in the loop */
					totalsong += 1;

					/* for each track, add the stream obj in an array so it can be accessible from the rest of the program */
			    	SC.stream('/tracks/'+ track.id, function(sound) {	    
					    songslist.push(sound);
					    /* check that it's accessible */
					    checkreadystate();
					});

			    	// create the list with a 'data-track' attribute that will contain the number of the track and that we will need to read the right track
					if (totalsong){
						$('#_tracks').append($('<li class="sc-a" data-track="'+ index +'" data-img="' + track.waveform_url + '"></li>').html(track.title + ' - ' + track.genre));
					} else {
						$('#_message').text('You don\'t have any uploads');
					}
					

			    });
			});
			
			
		});
	});


}); // close $(document).ready


function checkreadystate() {
	if(songslist.length == totalsong) { 

		/* if the list is completed, we can allow the list to be clicked and play the songs */
		jQuery('li.sc-a').click(function(){
			$('li.sc-a').css('color','#333');
			$(this).css('color','#f60');
			for (i=0; i<songslist.length; i++) {
				songslist[i].stop();
			}
			var imgwf = jQuery(this).attr('data-img');
			$('#_waveform').html('<img src="'+ imgwf +'" />');

			var numtrack = jQuery(this).attr('data-track');
			songslist[numtrack].play();

			playslideshow();
		});

		/* the buttons to stop every songs */
		jQuery('#_btnstop').click(function(){
			for (i=0; i<songslist.length; i++) {
				songslist[i].stop();
			}

		});


	}
};

/* funcion that will display the slideshow */
function playslideshow() {
	
	$('#_slides').show();
	$('#_slides').slidesjs({
        navigation: {
			active: false
  		},
  		pagination: {
			active: false
	    },
	    play: {
			active: false,
			effect: "fade",
			interval: 5000,
			auto: true
		}
    });

}




