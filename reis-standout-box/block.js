(() => {

	const el = wp.element.createElement;

    
	wp.blocks.registerBlockType( blockName, {
		title,
        icon: "columns",
		category: 'widgets',

		attributes: {
			textColor: {
				type: 'string',
				default: '',
			},
			backgroundColor: {
				type: 'string',
				default: '',
			},
		},

        supports: {
            align: ['wide'],
			color: true,
			gradient: true,
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