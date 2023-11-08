(() => {

	const el = wp.element.createElement;

	wp.blocks.registerBlockType( blockName, {
		title,
        icon: iconSrc
			? el('img', {
				src: iconSrc,
				alt: title,
				width: 20,
				height: 20,
			})
			: 'columns',
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
                        'core/heading', 'core/paragraph', 'core/list', 'core/spacer'
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