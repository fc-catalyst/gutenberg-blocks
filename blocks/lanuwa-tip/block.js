(() => {

	const el = wp.element.createElement;
	const attributes = { // to have the access to the default values
		align: {
			type: 'string',
			default: 'wide',
		},
	};

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

		attributes,

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
                        'core/heading', 'core/paragraph', 'core/list', 'core/spacer'
                    ],
                }),
			);
		},
		save: props => {

			return el( 'div',
				{ className: `${prefix}main` },
				el( 'div', {},
                	el( wp.blockEditor.InnerBlocks.Content ),
				),
            );
		},
	} );
})();