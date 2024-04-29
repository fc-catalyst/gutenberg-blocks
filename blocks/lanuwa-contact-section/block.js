(() => {

	const el = wp.element.createElement;
	const attributes = { // to have the access to the default values
		align: {
			type: 'string',
			default: 'full',
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
			align: ['full'],
        },

		edit: props => {

			return el( 'div',
				{ className: `${props.className} ${prefix}main`, style: { width: '100%', padding: '30px 0', backgroundColor: 'var(--wp--preset--color--grey-lighter)', textAlign: 'center' } },
				'Contact Form is printed instead of me',
			);
		},
		save: props => {
			return null;
		},
	} );
})();