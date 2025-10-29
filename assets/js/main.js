/*
	Phantom by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
	breakpoints({
		xlarge:   [ '1281px',  '1680px' ],
		large:    [ '981px',   '1280px' ],
		medium:   [ '737px',   '980px'  ],
		small:    [ '481px',   '736px'  ],
		xsmall:   [ '361px',   '480px'  ],
		xxsmall:  [ null,      '360px'  ]
	});

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Touch?
	if (browser.mobile)
		$body.addClass('is-touch');

	// Forms.
	var $form = $('form');

	// Auto-resizing textareas.
	$form.find('textarea').each(function() {
		var $this = $(this),
			$wrapper = $('<div class="textarea-wrapper"></div>'),
			$submits = $this.find('input[type="submit"]');

		$this
			.wrap($wrapper)
			.attr('rows', 1)
			.css('overflow', 'hidden')
			.css('resize', 'none')
			.on('keydown', function(event) {
				if (event.keyCode == 13 && event.ctrlKey) {
					event.preventDefault();
					event.stopPropagation();
					$(this).blur();
				}
			})
			.on('blur focus', function() {
				$this.val($.trim($this.val()));
			})
			.on('input blur focus --init', function() {
				$wrapper.css('height', $this.height());
				$this.css('height', 'auto')
				     .css('height', $this.prop('scrollHeight') + 'px');
			})
			.on('keyup', function(event) {
				if (event.keyCode == 9)
					$this.select();
			})
			.triggerHandler('--init');

		// Fix for IE or mobile
		if (browser.name == 'ie' || browser.mobile)
			$this.css('max-height', '10em').css('overflow-y', 'auto');
	});

	// Menu.
	var $menu = $('#menu');

	$menu.wrapInner('<div class="inner"></div>');

	$menu._locked = false;

	$menu._lock = function() {
		if ($menu._locked) return false;
		$menu._locked = true;
		window.setTimeout(function() {
			$menu._locked = false;
		}, 350);
		return true;
	};

	$menu._show = function() {
		if ($menu._lock())
			$body.addClass('is-menu-visible');
	};

	$menu._hide = function() {
		if ($menu._lock())
			$body.removeClass('is-menu-visible');
	};

	$menu._toggle = function() {
		if ($menu._lock())
			$body.toggleClass('is-menu-visible');
	};

	$menu
		.appendTo($body)
		.on('click', function(event) {
			event.stopPropagation();
		})
		.on('click', 'a', function(event) {
			var href = $(this).attr('href');
			event.preventDefault();
			event.stopPropagation();
			$menu._hide();
			if (href == '#menu') return;
			window.setTimeout(function() {
				window.location.href = href;
			}, 350);
		})
		.append('<a class="close" href="#menu">Close</a>');

	$body
		.on('click', 'a[href="#menu"]', function(event) {
			event.stopPropagation();
			event.preventDefault();
			$menu._toggle();
		})
		.on('click', function(event) {
			$menu._hide();
		})
		.on('keydown', function(event) {
			if (event.keyCode == 27) $menu._hide();
		});

	// --- Remove all decorative crosses/overlays on all tiles ---
	$(document).ready(function() {
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

		$('.tiles article *').each(function() {
			$(this).css({
				'background-image': 'none',
				'background': 'transparent',
				'box-shadow': 'none',
				'border': 'none'
			});
		});

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

// -----------------------
// SoundCloud Music Player
// -----------------------

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

(function() {
    const tracks = [
		{ title: "Valse Sentimentale", url: "https://w.soundcloud.com/hugo-reymond/shurdas" },
		{ title: "Valse Sentimentale", url: "https://w.soundcloud.com/hugo-reymond/stradimarius" },
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
        { title: "Daniel", url: "https://soundcloud.com/user-342226925/daniel-final-session-44100-1" }
    ];

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    let playOrder = [];
    let currentIndex = 0;
    let isPlaying = false;

    const player = document.getElementById("player");
    const titleDisplay = document.getElementById("current-track");
    const playBtn = document.getElementById("play-track");    
    const nextBtn = document.getElementById("next-track");    
    const prevBtn = document.getElementById("prev-track");    
    const shuffleBtn = document.getElementById("shuffle-track"); 

    // Crée le widget
    const widget = SC.Widget(player);

    // Mélanger les indices
    function shuffleArray(array) {
        const arr = array.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function initPlayOrder() {
        playOrder = shuffleArray(tracks.map((_, i) => i));
        currentIndex = 0;
    }

    function loadTrack(index, autoplay = true) {
        const track = tracks[playOrder[index]];
        titleDisplay.textContent = `▶️ ${track.title}`;
        widget.load(track.url, { auto_play: autoplay });
    }

    function togglePlay() {
        isPlaying = !isPlaying;
        playBtn.innerHTML = isPlaying
            ? '<i class="fa-solid fa-pause"></i>'
            : '<i class="fa-solid fa-play"></i>';
        loadTrack(currentIndex, isPlaying);
    }

    function nextTrack() {
        currentIndex++;
        if (currentIndex >= playOrder.length) initPlayOrder();
        loadTrack(currentIndex, isPlaying);
    }

    function prevTrack() {
        if (currentIndex > 0) currentIndex--;
        else currentIndex = playOrder.length - 1;
        loadTrack(currentIndex, isPlaying);
    }

    function onTrackEnd() {
        nextTrack();
    }

    function startShuffle() {
        initPlayOrder();
        isPlaying = true;
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        loadTrack(currentIndex, true);
    }

    // Bind des événements boutons
    playBtn.addEventListener("click", togglePlay);
    nextBtn.addEventListener("click", nextTrack);
    prevBtn.addEventListener("click", prevTrack);
    shuffleBtn.addEventListener("click", startShuffle);

    // Attend que le widget soit prêt avant de charger la première musique
    widget.bind(SC.Widget.Events.READY, function() {
        initPlayOrder();
        loadTrack(currentIndex, false); // Ne joue pas automatiquement
        widget.bind(SC.Widget.Events.FINISH, onTrackEnd); // Fin d'un track
    });

	})();

})(jQuery);
