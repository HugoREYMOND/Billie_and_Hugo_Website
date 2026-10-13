/*
 * script.js : behaviour of THIS page (folder: pages/music)
 *
 * Loaded after jQuery (assets/vendor/jquery.min.js), see the <script> tags at the bottom of main.html.
 * Based on the Phantom template (HTML5 UP). English comments added.
 * Only the parts this page actually needs have been kept.
 *
 * CONTENTS (Ctrl+F on the number):
 *   1. Detecting phone / Internet Explorer
 *   2. Page arrival animation
 *   3. Touch mode
 *   4. Form: message box that grows
 *   5. Tiles: removing the template decorations
 *   6. SoundCloud music player
 */

(function($) {

	var $window = $(window),
		$body = $('body');

	// ============================================================
	// 1. DETECTING "PHONE / INTERNET EXPLORER"
	// ============================================================
	// Replaces the old browser.min.js library (no longer loaded).
	// We only need two answers:
	//   isMobile: true on Android, iPhone/iPad, Windows Phone or BlackBerry
	//   isIE    : true if the browser is Internet Explorer
	var ua = navigator.userAgent;

	// Browser: take the first pattern that matches (the order matters).
	var navigateurs = [
		['firefox', /Firefox\/[0-9.]+/],
		['bb',      /BlackBerry.+Version\/[0-9.]+/],
		['bb',      /BB[0-9]+.+Version\/[0-9.]+/],
		['opera',   /OPR\/[0-9.]+/],
		['opera',   /Opera\/[0-9.]+/],
		['edge',    /Edge\/[0-9.]+/],
		['safari',  /Version\/[0-9.]+.+Safari/],
		['chrome',  /Chrome\/[0-9.]+/],
		['ie',      /MSIE [0-9]+/],
		['ie',      /Trident\/.+rv:[0-9]+/]
	];
	var navigateur = 'other';
	for (var i = 0; i < navigateurs.length; i++) {
		if (ua.match(navigateurs[i][1])) { navigateur = navigateurs[i][0]; break; }
	}

	// Operating system: same principle, first matching pattern wins.
	var systemes = [
		['ios',     /([0-9_]+) like Mac OS X/],
		['ios',     /CPU like Mac OS X/],
		['wp',      /Windows Phone [0-9.]+/],
		['android', /Android [0-9.]+/],
		['mac',     /Macintosh.+Mac OS X [0-9_]+/],
		['windows', /Windows NT [0-9.]+/],
		['bb',      /BlackBerry.+Version\/[0-9.]+/],
		['bb',      /BB[0-9]+.+Version\/[0-9.]+/],
		['linux',   /Linux/],
		['bsd',     /BSD/],
		['unix',    /X11/]
	];
	var systeme = 'other';
	for (var j = 0; j < systemes.length; j++) {
		if (ua.match(systemes[j][1])) { systeme = systemes[j][0]; break; }
	}

	// Special case: a recent iPad reports itself as a Mac. We recognise it by its touch screen
	// and its screen sizes, and treat it as iOS.
	if (systeme == 'mac' && 'ontouchstart' in window &&
		((screen.width == 1024 && screen.height == 1366) ||
		 (screen.width == 834  && screen.height == 1112) ||
		 (screen.width == 810  && screen.height == 1080) ||
		 (screen.width == 768  && screen.height == 1024)))
		systeme = 'ios';

	var isIE     = (navigateur == 'ie');
	var isMobile = (systeme == 'wp' || systeme == 'android' || systeme == 'ios' || systeme == 'bb');

	// ============================================================
	// 2. PAGE ARRIVAL ANIMATION
	// ============================================================
	// The <body> starts with the class "is-preload" (see main.html): the CSS uses it to hide
	// the elements that should fade in. 100 ms after the page has finished loading,
	// we remove that class and the animations start.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// ============================================================
	// 3. TOUCH MODE
	// ============================================================
	// On a phone/tablet we add the class "is-touch" to the <body>; the CSS uses it to
	// turn off hover effects (which make no sense with a finger).
	if (isMobile)
		$body.addClass('is-touch');

	// ============================================================
	// 4. "GET IN TOUCH" FORM: MESSAGE BOX THAT GROWS
	// ============================================================
	// Each <textarea> (the "Message" field) is wrapped in a <div class="textarea-wrapper">,
	// reduced to 1 line, then grows automatically as you type.
	$('form').find('textarea').each(function() {
		var $this = $(this),
			$wrapper = $('<div class="textarea-wrapper"></div>');

		$this
			.wrap($wrapper)                      // wrap it in the <div>
			.attr('rows', 1)                     // start with 1 line
			.css('overflow', 'hidden')           // no scrollbar
			.css('resize', 'none')               // no resize handle
			.on('keydown', function(event) {
				// Ctrl + Enter: leave the field
				if (event.keyCode == 13 && event.ctrlKey) {
					event.preventDefault();
					event.stopPropagation();
					$(this).blur();
				}
			})
			.on('blur focus', function() {
				// Remove useless spaces at the start/end of the text
				$this.val($.trim($this.val()));
			})
			.on('input blur focus --init', function() {
				// Recompute the height from the amount of text
				$wrapper.css('height', $this.height());
				$this.css('height', 'auto')
				     .css('height', $this.prop('scrollHeight') + 'px');
			})
			.on('keyup', function(event) {
				// Tab key: select all the text in the field
				if (event.keyCode == 9)
					$this.select();
			})
			.triggerHandler('--init');           // compute the height a first time

		// Internet Explorer or phone: maximum height + scrollbar
		if (isIE || isMobile)
			$this.css('max-height', '10em').css('overflow-y', 'auto');
	});

	// ============================================================
	// 5. TILES: REMOVING THE TEMPLATE'S DECORATIONS
	// ============================================================
	// Once the page is ready, we remove the crosses, icons and overlays inherited from the
	// template from the tiles (.tiles article), and force transparent background/border/shadow.
	// (The CSS already does almost the same with "!important": belt and braces.)
	$(document).ready(function() {
		// 1) Remove the decorative elements
		const selectors = [
			'.tiles article .overlay',
			'.tiles article .icon',
			'.tiles article .close',
			'.tiles article .tile-close',
			'.tiles article .decoration',
			'.tiles article svg'
		];
		selectors.join(',').split(',').forEach(function(sel) {
			$(sel.trim()).remove();
		});

		// 2) Remove background, shadow and border from everything inside a tile
		$('.tiles article *').each(function() {
			$(this).css({
				'background-image': 'none',
				'background': 'transparent',
				'box-shadow': 'none',
				'border': 'none'
			});
		});

		// 3) Add to <head> a CSS rule that hides the ::before / ::after pseudo-elements of tiles
		$('<style>')
			.text(`
				.tiles article::before,
				.tiles article::after,
				.tiles article:hover::before,
				.tiles article:hover::after {
					content: "" !important;
					display: none !important;
					visibility: hidden !important;
					opacity: 0 !important;
					background: none !important;
					width: 0 !important;
					height: 0 !important;
				}
			`)
			.appendTo('head');
	});

	// ============================================================
	// 6. SOUNDCLOUD MUSIC PLAYER (Music page only)
	// ============================================================
	// Needs the script https://w.soundcloud.com/player/api.js (loaded in main.html)
	// and these HTML elements: #player (iframe), #current-track, #play-track, #next-track,
	// #prev-track, #shuffle-track.
	(function() {

		// ----- TRACK LIST: this is WHERE you add / remove / rename a song -----
		// One line per song:  { title: "Displayed name", url: "SoundCloud link" },
		// (careful: no comma after the LAST song)
		const tracks = [
			{ title: "Shurdas", url: "https://soundcloud.com/hugo-reymond/shurdas" },
			{ title: "Stradimarius", url: "https://soundcloud.com/hugo-reymond/stradimarius" },
			{ title: "Valse Sentimentale", url: "https://soundcloud.com/hugo-reymond/valse-sentimentale" },
			{ title: "Medley Roumain", url: "https://soundcloud.com/hugo-reymond/medley-roumain" },
			{ title: "Bossa Dorado", url: "https://soundcloud.com/hugo-reymond/bossa-dorado" },
			{ title: "Jazz Man", url: "https://soundcloud.com/user-342226925/jazz-man-beth-hart-cover-by" },
			{ title: "Ain't No Sunshine", url: "https://soundcloud.com/user-342226925/aint-no-sunshine-bill-withers" },
			{ title: "Raggamuffin", url: "https://soundcloud.com/user-342226925/raggamuffin-selah-sue-cover-by" },
			{ title: "Spooky", url: "https://soundcloud.com/user-342226925/spooky-dusty-springfield-cover" },
			{ title: "Tall Ground", url: "https://soundcloud.com/user-342226925/tall-ground-deluxe-cover-by" },
			{ title: "Two Bare Feet", url: "https://soundcloud.com/user-342226925/two-bare-feet-katie-melua" },
			{ title: "Mustang Sally", url: "https://soundcloud.com/user-342226925/mustang-sally-wilson-pickett" },
			{ title: "Daniel", url: "https://soundcloud.com/user-342226925/daniel-final-session-44100-1" },
			{ title: "Don't Tell Me Who I'm Gonna Be", url: "https://soundcloud.com/user-309912337/e6007bad-b096-4e2a-9d8b-0ee7ee4c5d8e" },
			{ title: "Falling Rain", url: "https://soundcloud.com/user-309912337/falling-rain" },
			{ title: "I Don't Wanna Know", url: "https://soundcloud.com/user-309912337/i-dont-wanna-know" },
			{ title: "Happiness", url: "https://soundcloud.com/user-309912337/19196180-cd4a-45bf-95c5-94ce26ca5702" }
		];
		// -----------------------------------------------------------------------

		let playOrder = [];      // play order (shuffled)
		let currentIndex = 0;    // position in the play order
		let isPlaying = false;   // true while the music is playing

		// Page elements
		const player = document.getElementById("player");              // the SoundCloud iframe
		const titleDisplay = document.getElementById("current-track"); // text showing the current title
		const playBtn = document.getElementById("play-track");         // play / pause button
		const nextBtn = document.getElementById("next-track");         // next button
		const prevBtn = document.getElementById("prev-track");         // previous button
		const shuffleBtn = document.getElementById("shuffle-track");   // shuffle button

		// Create the SoundCloud widget from the iframe
		const widget = SC.Widget(player);

		// Shuffle a list (Fisher-Yates algorithm)
		function shuffleArray(array) {
			const arr = array.slice();
			for (let i = arr.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[arr[i], arr[j]] = [arr[j], arr[i]];
			}
			return arr;
		}

		// Prepare a new random play order
		function initPlayOrder() {
			playOrder = shuffleArray(tracks.map((_, i) => i));
			currentIndex = 0;
		}

		// Load a track into the player (and play it if autoplay = true)
		function loadTrack(index, autoplay = true) {
			const track = tracks[playOrder[index]];
			titleDisplay.textContent = `▶️ ${track.title}`;
			widget.load(track.url, { auto_play: autoplay });
		}

		// Play / pause button
		function togglePlay() {
			isPlaying = !isPlaying;
			playBtn.innerHTML = isPlaying
				? '<i class="fa-solid fa-pause"></i>'
				: '<i class="fa-solid fa-play"></i>';
			loadTrack(currentIndex, isPlaying);
		}

		// Next track (reshuffle when we reach the end of the list)
		function nextTrack() {
			currentIndex++;
			if (currentIndex >= playOrder.length) initPlayOrder();
			loadTrack(currentIndex, isPlaying);
		}

		// Previous track (from the first one, jump to the last)
		function prevTrack() {
			if (currentIndex > 0) currentIndex--;
			else currentIndex = playOrder.length - 1;
			loadTrack(currentIndex, isPlaying);
		}

		// When a track ends, go to the next one
		function onTrackEnd() {
			nextTrack();
		}

		// Shuffle button: new order + start playing immediately
		function startShuffle() {
			initPlayOrder();
			isPlaying = true;
			playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
			loadTrack(currentIndex, true);
		}

		// Connect each button to its function
		playBtn.addEventListener("click", togglePlay);
		nextBtn.addEventListener("click", nextTrack);
		prevBtn.addEventListener("click", prevTrack);
		shuffleBtn.addEventListener("click", startShuffle);

		// Wait for the player to be ready before loading the first track
		widget.bind(SC.Widget.Events.READY, function() {
			initPlayOrder();
			loadTrack(currentIndex, false);                    // without starting playback automatically
			widget.bind(SC.Widget.Events.FINISH, onTrackEnd);  // when a track finishes
		});

	})();

})(jQuery);
