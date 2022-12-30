// fcOnVisibleDo1() is the function to run a function if an object top is in the vertical visibility range

(function() {
    let load = [],
        timer = setTimeout( ()=>{} ),
		emax = 0;

    function add( obj, func, bias = 0, delay = 0 ) { // bias: -20 for later 20 for earlier
        if ( !obj || !func ) { return }

        const add = function(obj) { // ++if the object is an array of bojects
            if ( typeof obj !== 'object' ) { return }
            if ( typeof jQuery !== 'undefined' && obj instanceof jQuery ) { obj = obj[0] }
            load.push( { o : obj, f : func, b : bias, d : delay, t : top( obj ) + bias } );
			// object, function, bias, delay, top position, remove marker, executing now marker
        };

        if ( typeof obj ==='string' ) { document.querySelectorAll( obj ).forEach( add ) }
        if ( typeof obj === 'object' ) { add( obj ) }

        if ( load.length === 0 ) { return }

        start();
    }

    function check() {

        const win_bot = window.scrollY + window.innerHeight;
		const timestamp = Date.now();

		emax = emax < timestamp ? timestamp : emax;

		load = load.filter( el => {

            if ( win_bot < el.t ) { return true }

			emax = emax === timestamp ? emax + 1 : emax + el.d; // delay starting with second
			//emax = emax + el.d; // delay every

			setTimeout( () => {
				el.f( el.o );
			}, emax - timestamp );

			return false;

		});

		clearTimeout( timer );
        if ( load.length === 0 ) { clear(); return }
        timer = setTimeout( recount, 500 ); // recount every scroll-stop in case of something loads a bit lazy
    }

    function recount() {
        for ( let k in load ) { load[k].t = top( load[k].o ) + load[k].b }
    }

    function top(obj) {
        return obj.getBoundingClientRect().top + window.scrollY;
    }

    function start() {
        clear();
        document.addEventListener( 'scroll', check );
        window.addEventListener( 'resize', recount );
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
