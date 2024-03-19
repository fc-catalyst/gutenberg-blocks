!function(){let a=setInterval(function(){let b=document.readyState;if(b!=='complete'&&b!=='interactive'){return}clearInterval(a);a=null;

    // youtube video exists
    if ( !document.querySelector('.fc-lanuwa-youtube-video > iframe') ) { return } // make wait for the borlabs case

    // youtube api
    const api_script = document.createElement('script');
    api_script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(api_script);

    // init all players
    window.onYouTubeIframeAPIReady = () => {
        document.querySelectorAll('.fc-lanuwa-youtube-video').forEach( player_holder => {

            // organize the replacement for printing new player
            const iframe = player_holder.querySelector('iframe');
            const victim = document.createElement('div');
            player_holder.replaceChild(victim, iframe);

            // print the player iframe
            const id = player_holder.getAttribute('data-id');
            const player = new YT.Player( victim, {
                width: '560',
                height: '315',
                videoId: id,
                playerVars: {
                    'playsinline': 1
                }
            });

            // add the scroll buttons events
            player_holder.nextSibling.querySelectorAll('button').forEach( button => {
                button.addEventListener( 'click', e => {
                    const seekTo = button.querySelector('span').innerText;
                    player.seekTo( time_to_seconds(seekTo), true );
                    player.playVideo();
                });
            });

        });
    }

    const time_to_seconds = time => {
        const [minutes, seconds] = time.split(':').map(Number);
        return minutes * 60 + seconds;
    };

}, 300 )}();