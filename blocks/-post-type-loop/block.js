( function() {
	const el = wp.element.createElement;

	wp.blocks.registerBlockType( 'fcp-gutenberg/post-type-loop', {
		title: 'Post Type left-right Navigation Loop',
        icon: 'columns',
		category: 'widgets',

		edit: function( props ) {

			return el( 'div', { className: 'fcp-post-type-loop' },
				el( 'div', {}, 'Next Post Link' ),
				el( 'div', {}, 'Previous Post Link' )
			);
		},
		save: function( props ) {
            return null;
		}
	} );
})();
