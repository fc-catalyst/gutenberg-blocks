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
			images: {
                type: 'array',
                default: []
            },
			imgPosRight: {
				type: 'boolean',
				defulat: false
			},
			link: {
				type: 'string',
			},
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

			const onSelectImage = (media, ind) => {
                const images = [...props.attributes.images];
                const newImage = {
                    id: media.id,
                    url: media.url,
					thumbnail: media.sizes.medium ? media.sizes.medium.url : media.url, // .thumbnail
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

			return el( 'div',
				{ className: `${props.className} ${prefix}main ${props.attributes.imgPosRight ? `${prefix}image-right` : ''}` },
				el( ...mediaBox(0) ),
				el( wp.blockEditor.InnerBlocks, {
                    allowedBlocks: [
                        'core/heading', 'core/paragraph', 'core/list', 'core/buttons', 'core/spacer'
                    ],
                    template: [
                        [ 'core/heading', {} ],
						[ 'core/paragraph', {} ],
						[ 'core/buttons', {} ]
                    ],
                    templateLock: false
                }),
				el( wp.element.Fragment, // sidebar
				{},
				el( wp.blockEditor.InspectorControls, {},
					el( wp.components.PanelBody, {},
						el( wp.components.TextControl, {
							label: 'Link the image to a URL',
							value: props.attributes.link || '',
							onChange: value => {
								props.setAttributes( { link: value } );
							},
						}),
						el( wp.components.ToggleControl, {
							label: 'Image Position Right',
							checked: props.attributes.imgPosRight,
							onChange: () => {
								props.setAttributes({ imgPosRight: !props.attributes.imgPosRight });
							},
						}),
					)
				)
			)
			);
		},
		save: props => {
			const image = props.attributes.images[0]?.url
				? el( 'img', { src: props.attributes.images[0].url, alt: 'Photo' } )
				: null;
			const link = image && props.attributes.link
				? el( 'a', { href: props.attributes.link, className: `${prefix}image` }, image )
				: null;
			const span = image && !props.attributes.link
				? el( 'span', { className: `${prefix}image` }, image )
				: null;
            return el( 'div',
				{ className: `${prefix}main ${props.attributes.imgPosRight ? `${prefix}image-right` : ''}` },
                el( wp.blockEditor.InnerBlocks.Content ),
				link || span
            );
		},
	} );
})();