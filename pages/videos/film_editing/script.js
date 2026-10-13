/*
 * script.js : behaviour of THIS page (folder: pages/videos/film_editing)
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

})(jQuery);
