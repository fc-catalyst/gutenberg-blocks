(() => {

	const el = wp.element.createElement;
	const attributes = { // to have the access to the default values
		ids: {
			type: 'string',
			default: '',
		},
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
				'List of posts/pages. Posts\' ids separated by comma:',
				el(wp.components.TextControl, {
					style: { maxWidth: '360px' },
					placeholder: '1, 2, 3',
					value: props.attributes.ids,
					onChange: value => {
						props.setAttributes({ ids: value });
					},
				}),
			);
		},
		save: props => {
			return null;
		},
	} );
})();