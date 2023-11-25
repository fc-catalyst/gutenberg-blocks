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
			termin_new_available: {
				type: 'boolean',
			},
			address: {
				type: 'string',
			},
			video_available: {
				type: 'boolean',
			},
			link: {
				type: 'string',
			}
		},

        supports: {
			spacing: {
				margin: ['top', 'bottom'],
			},
        },

		edit: props => {
			return el( 'div',
				{ className: `${props.className} ${prefix}main` },
				el('header', {},
					el('h2', {Content: 'Das Wichtigste im Überblick'})
				),
				el( wp.element.Fragment, // sidebar
				{},
				el( wp.blockEditor.InspectorControls, {},
					el( wp.components.PanelBody, {},
						el(wp.components.ToggleControl, {
							label: 'Online-Buchung auch für Neupatient:innen möglich',
							checked: props.attributes.termin_new_available || false,
							onChange: () => {
								props.setAttributes({ termin_new_available: value });
							}
						}),
						el( wp.components.TextControl, {
							label: 'Addresse',
							value: props.attributes.address || '',
							onChange: value => {
								props.setAttributes( { address: value } );
							},
						}),
						el(wp.components.ToggleControl, {
							label: 'Videosprechstunde verfügbar',
							checked: props.attributes.termin_new_available || false,
							onChange: () => {
								props.setAttributes({ termin_new_available: value });
							}
						}),
						el( wp.components.TextControl, {
							label: 'Termin Buchen URL',
							value: props.attributes.link || '',
							onChange: value => {
								props.setAttributes( { link: value } );
							},
						}),
					)
				)
			)
			);
		},
		save: props => {
            return el( 'div',
				{ className: `${prefix}main` },
                el( wp.blockEditor.InnerBlocks.Content ),
				link || span
            );
		},
	} );
})();