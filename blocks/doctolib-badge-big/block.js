(() => {

	const el = wp.element.createElement;

	const breakLines = text => {
		return text.split('\n').map((line, index) => [
			el('span', { key: index }, line),
			index < text.split('\n').length - 1 && el('br')
		]);
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

		attributes: {
			termin_new_available: {
				type: 'boolean',
				default: true,
			},
			address: {
				type: 'string',
				default: '',
			},
			video_available: {
				type: 'boolean',
				default: true,
			},
			link: {
				type: 'string',
				default: '',
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
					el('h2', {}, 'Termin online vereinbaren' )
				),
				el('div', {className: `${prefix}content`},
					props.attributes.termin_new_available
						? el('div', {className: `${prefix}termin`}, el('h3', {}, 'Online-Buchung auch für Neupatient:innen möglich'))
						: null,
					props.attributes.address.trim()
						//? el('div', {className: `${prefix}address`}, el('p', {dangerouslySetInnerHTML: { __html: props.attributes.address.replace(/\n/g, '<br>')}}))
						? el('div', {className: `${prefix}address`}, el('h3', {}, 'Standort der Sprechstunde'), el('p', {}, breakLines(props.attributes.address)))
						: null,
					props.attributes.video_available
						? el('div', {className: `${prefix}video`}, el('h3', {}, 'Videosprechstunde verfügbar'))
						: null,
					el( wp.blockEditor.InnerBlocks, {
						className: `${prefix}free-content`,
						allowedBlocks: [
							'core/heading', 'core/paragraph', 'core/list', 'core/buttons', 'core/spacer', 'core/table'
						],
						template: [
							[ 'core/heading', {level: 3, content: 'Sprechzeiten'} ],
							[ 'core/list', {} ]
						],
						templateLock: false
					}),
					props.attributes.link.trim()
						? el('div', {className: `${prefix}book-button`}, el('a', {href: props.attributes.link, target: '_blank', rel: 'noopener noreferrer'}, 'Termin buchen'))
						: null,
				),
				el( wp.element.Fragment, // sidebar
				{},
				el( wp.blockEditor.InspectorControls, {},
					el( wp.components.PanelBody, {},
						el(wp.components.ToggleControl, {
							label: 'Online-Buchung auch für Neupatient:innen möglich',
							checked: props.attributes.termin_new_available || false,
							onChange: () => {
								props.setAttributes({ termin_new_available: !props.attributes.termin_new_available });
							}
						}),
						el( wp.components.TextareaControl, {
							label: 'Addresse',
							value: props.attributes.address || '',
							onChange: value => {
								props.setAttributes( { address: value.trim() } );
							},
						}),
						el(wp.components.ToggleControl, {
							label: 'Videosprechstunde verfügbar',
							checked: props.attributes.video_available || false,
							onChange: () => {
								props.setAttributes({ video_available: !props.attributes.video_available });
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
				el('header', {},
					el('h2', {}, 'Termin online vereinbaren')
				),
				el('div', {className: `${prefix}content`},
					props.attributes.termin_new_available
						? el('div', {className: `${prefix}termin`}, el('h3', {}, 'Online-Buchung auch für Neupatient:innen möglich'))
						: null,
					props.attributes.address.trim()
						? el('div', {className: `${prefix}address`}, el('h3', {}, 'Standort der Sprechstunde'), el('p', {}, breakLines(props.attributes.address)))
						: null,
					props.attributes.video_available
						? el('div', {className: `${prefix}video`}, el('h3', {}, 'Videosprechstunde verfügbar'))
						: null,
					el( 'div',
						{ className: `${prefix}free-content` },
						el( wp.blockEditor.InnerBlocks.Content ),
					),
					props.attributes.link.trim()
						? el('div', {className: `${prefix}book-button`}, el('a', {href: props.attributes.link, target: '_blank', rel: 'noopener noreferrer'}, 'Termin buchen'))
						: null,
				),
            );
		},
	} );
})();