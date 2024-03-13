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
			align: {
				type: 'string',
				default: 'wide',
			}
		},

        supports: {
            align: ['wide'],
			color: {
				gradients: true,
			},
			spacing: {
				margin: ['top', 'bottom'],
			},
        },

		edit: props => {

			return el( 'div',
				{ className: `${props.className} ${prefix}main` },
				el( wp.blockEditor.InnerBlocks, {
                    allowedBlocks: [
                        'core/heading', 'core/paragraph', 'core/list'
                    ],
                    template: [
                        [ 'core/heading', {} ],
						[ 'core/list', { ordered: false, values: ['', ''] } ]
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