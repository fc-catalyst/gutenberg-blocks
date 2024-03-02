(() => {

	const el = wp.element.createElement;
	const attributes = { // to have the access to the default values
		images: {
			type: 'array',
			default: [],
		},
		verifiedText: {
			type: 'string',
			default: 'Geprüft durch LANUWA',
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
			color: {
				gradients: true,
			},
			spacing: {
				margin: ['top', 'bottom'],
			},
        },

		edit: props => {

			const onSelectImage = (media, ind) => {
                const images = [...props.attributes.images];
                const newImage = {
                    id: media.id,
                    url: media.url,
					thumbnail: media.sizes.large ? media.sizes.large.url : media.url, // .thumbnail
                };
                images[ind] = newImage;
                props.setAttributes({ images });
			};

            const mediaBox = ind => {
                const images = [...props.attributes.images];
                const mediaID = images[ind]?.id || 0;
				const mediaThumbnail = images[ind]?.thumbnail || images[ind]?.url;
                return [
                    'figure',
                    {},
                    el( wp.blockEditor.MediaUpload, {
                        onSelect: media => { onSelectImage(media, ind) },
                        allowedTypes: 'image',
                        value: mediaID,
                        render: obj => {
                            return el(
                                wp.components.Button,
                                {
                                    type: 'button',
                                    className: 'select-image ' + (mediaID || 'empty-image'),
                                    onClick: obj.open,
                                },
                                mediaID
                                    ? el( 'img', { src: mediaThumbnail } )
                                    : el( 'span', {}, 'Image' ),
                                mediaID
                                    ? el( 'button', { type: 'button', className: 'clear-image', onClick: e => {
                                        e.stopPropagation();
                                        images[ind].id = 0;
                                        images[ind].url = '';
                                        props.setAttributes({ images });
                                      }}, '+' )
                                    : null,
                            );
                        },
                    })
                ];

            };

            let style = {};
			if ( props.attributes.images[0]?.url ) { style['--sideImage'] = `url('${props.attributes.images[0]?.url}')`; }
			return el( 'div',
				{ className: `${props.className} ${prefix}main`, style },
				el( 'div', { className: `${prefix}label` }, props.attributes.verifiedText ),
				el( wp.blockEditor.InnerBlocks, {
                    allowedBlocks: [
                        'core/heading', 'core/paragraph', 'core/list', 'core/buttons', 'core/spacer'
                    ],
                    template: [
                        [ 'core/heading', {level: 3} ],
						[ 'core/paragraph', {} ]
                    ],
                    templateLock: false,
                }),
				el( wp.element.Fragment, // sidebar
					{},
					el( wp.blockEditor.InspectorControls, {},
						el( wp.components.PanelBody, { className: `${prefix}main`, style },
							el(wp.components.TextControl, {
								label: 'Verified text',
								value: props.attributes.verifiedText || attributes.verifiedText.default,
								onChange: value => {
									props.setAttributes({ verifiedText: value });
								},
							}),
							el( ...mediaBox(0) ),
						)
					),
				)
			);
		},
		save: props => {
			const image = props.attributes.images[0]?.url
				? el( 'img', { src: props.attributes.images[0].url, alt: 'Side image' } )
				: null;
			const span = image && !props.attributes.link
				? el( 'span', { className: `${prefix}image` }, image )
				: null;

			let style = {};
			return el( 'div',
				{ className: `${prefix}main`, style },
				span,
				el( 'div', { className: `${prefix}label` }, props.attributes.verifiedText ),
                el( wp.blockEditor.InnerBlocks.Content ),
            );
		},
	} );
})();