!function(){let a=setInterval(function(){let b=document.readyState;if(b!=='complete'&&b!=='interactive'||typeof jQuery==='undefined'){return}const $=jQuery;clearInterval(a);a=null;

/*
    const api_script = document.createElement('script');
    api_script.src = 'https://www.youtube.com/iframe_api';
    document.append(api_script);

    player = $(e.target).parents('.fc-lanuwa-youtube-main').find('iframe')[0];

    $('.fc-lanuwa-youtube-timemarks button').on('click', e => {
        console.log('works');
        seekTo(30);
    });

/*
var player;

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
function onYouTubeIframeAPIReady() {
    player = new YT.Player( $(e.target).parents('.fc-lanuwa-youtube-main').find('iframe')[0], {
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    // Event listener for when player is ready
}

// Function to scroll to a specific time mark in the YouTube video
function scrollToTime(seconds) {
    if(player != null) {
        player.seekTo(seconds, true);
    }
}

$('.fc-lanuwa-youtube-timemarks button').on('click', e => {
    console.log('works');
    scrollToTime(30);
});

/*
    const api_script = document.createElement('script');
    api_script.src = 'https://www.youtube.com/iframe_api';
    document.append(api_script);

    $('.fc-lanuwa-youtube-timemarks button').on('click', e => {
        const iframe = $(e.target).parents('.fc-lanuwa-youtube-main').find('iframe')[0];
        player = new YT.Player(iframe, {
            events: {
                'onReady': onPlayerReady
            }
        });
        if( player != null ) {
            player.seekTo(100, true);
        }        
    });
//*/
/*
    const scrollToTime = seconds => {
        $().parents('.fc-lanuwa-youtube-main');
        player = document.getElementById('youtube-video');
        if(player != null) {
            player.contentWindow.postMessage('{"event":"command","func":"' + 'seekTo' + '","args":[' + seconds + ',"true"]}', '*');
        }
    }
//*/
    generateYoutubePlayer();
    $('.fc-lanuwa-youtube-timemarks button').on('click', e => {
        scrollToTime(100);
    });
}, 300 )}();


var player;

// Function to generate the YouTube iframe
function generateYoutubePlayer() {
    var placeholder = document.getElementById('player-placeholder');
    if (placeholder) {
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/-ffRvuRRVEE?enablejsapi=1';
        iframe.width = '560';
        iframe.height = '315';
        iframe.id = 'youtube-video';
        iframe.frameborder = '0';
        iframe.allowfullscreen = true;
        placeholder.appendChild(iframe);

        // Initialize the player after the iframe has been generated
        initPlayer();
    }
}

// Initialize the YouTube player
function initPlayer() {
    player = new YT.Player('youtube-video', {
        events: {
            'onReady': onPlayerReady
        }
    });
}

// Event listener for when player is ready
function onPlayerReady(event) {
    // Player is ready
}

// Function to scroll to a specific time mark in the YouTube video
function scrollToTime(seconds) {
    if(player != null) {
        player.seekTo(seconds, true);
    }
}