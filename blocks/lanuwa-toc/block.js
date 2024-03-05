(() => {

	const el = wp.element.createElement;
	const attributes = { // to have the access to the default values
		align: {
			type: 'string',
			default: '',
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
				padding: true
			},
        },

		edit: props => {

			return el( 'ul',
				{ className: `${props.className} ${prefix}main` },
				el( 'li', {}, 'Item 1 Heading' ),
				el( 'li', {}, 'Item 2 Heading' ),
				el( 'li', {}, 'Item 3 Heading' ),
				el( 'li', {}, '...' ),
			);
		},
		save: props => {
			return el( 'ul',
				{ className: `${prefix}main` },
            );
		},
	} );
})();