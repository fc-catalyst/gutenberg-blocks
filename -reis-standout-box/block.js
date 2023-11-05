(() => {

	const el = wp.element.createElement;

    
	wp.blocks.registerBlockType( blockName, {
		title: 'FC Info Box',
        icon: 'columns',
		category: 'widgets',

		attributes: {
		},

        supports: {
            align: ['wide'],
        },

		edit: props => {

			return el( 'div',
				{ className: `${props.className} ${prefix}main` },
				el( wp.blockEditor.InnerBlocks, {
                    allowedBlocks: [
                        'core/heading', 'core/paragraph', 'core/list'
                    ],
                    template: [
                        [ 'core/paragraph', {} ]
                    ],
                    templateLock: false
                }),
			);
		},
		save: props => {
            return el( 'div',
				{ className: `${prefix}main` },
                el( wp.blockEditor.InnerBlocks.Content )
            );
		},
	} );
})();