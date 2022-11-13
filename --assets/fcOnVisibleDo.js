// fcOnVisibleDo1() is the function to run a function if an object top is in the vertical visibility range

(function() {
    let load = [],
        timer = setTimeout( ()=>{} );

    function add( obj, func, bias = 0, delay = 0 ) { // bias: +20 for later -20 for earlier
        if ( !obj || !func ) { return }

        const add = function(obj) { // ++if the object is an array of bojects
            if ( typeof obj !== 'object' ) { return }
            if ( typeof jQuery !== 'undefined' && obj instanceof jQuery ) { obj = obj[0] }
            load.push( { o : obj, f : func, b : bias ? bias : 0, t : top( obj ), d : delay, r : false } );
        };
        
        if ( typeof obj ==='string' ) { document.querySelectorAll( obj ).forEach( add ) }
        if ( typeof obj === 'object' ) { add( obj ) }

        if ( load.length === 0 ) { return }

        start();
    }

    async function check() {

        const win_bot = window.scrollY + window.innerHeight;
        for ( let k in load ) {
            // ++can add comparing for scrolling up from below
            if ( win_bot < load[k].t + load[k].b ) { continue }

            if ( load[k].d ) { await new Promise( resolve => setTimeout( resolve, load[k].d ) ) }

            load[k].f( load[k].o );
            load[k].r = true; // remove
        }

        load = load.filter( el => !el.r );

        if ( load.length === 0 ) { clear(); return }
        
        clearTimeout( timer );
        timer = setTimeout( recount, 500 ); // recount every scroll-stop in case of something loads a bit lazy
    }
    
    function recount() {
        for ( let k in load ) { load[k].t = top( load[k].o ) }
    }

    function top(obj) {
        return obj.getBoundingClientRect().top + window.scrollY;
    }
    
    function start() {
        clear();
        document.addEventListener( 'scroll', check );
        window.addEventListener( 'resize', recount ); // ++can replace with a bodyResize custom event to avoid rude^
        check();
    }
    function clear() {
        document.removeEventListener( 'scroll', check );
        window.removeEventListener( 'resize', recount );
    }

    window.fcOnVisibleDo1 = add; // object or selector, function to run, offset, use on loaded document
    window.fcOnVisibleDo1.check = check; // can be attached to other events
    window.fcOnVisibleDo1.recount = recount; // can be attached to other events

})();