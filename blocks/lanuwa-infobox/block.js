(() => {

	const el = wp.element.createElement;
	const attributes = { // to have the access to the default values
		images: {
			type: 'array',
			default: [],
		},
		align: {
			type: 'string',
			default: 'full',
		},
		blockWidth: {
			type: 'number',
			default: 890,
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
			align: ['wide', 'full'],
			color: {
				gradients: true,
			},
			spacing: {
				margin: ['top', 'bottom'],
				padding: true
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
            if ( props.attributes.blockWidth ) { style['--blockWidth'] = `${props.attributes.blockWidth || attributes.blockWidth.default}px`; }
			if ( props.attributes.images[0]?.url ) { style['--sideImage'] = `url('${props.attributes.images[0]?.url}')`; }
			return el( 'div',
				{ className: `${props.className} ${prefix}main`, style },
				el( wp.blockEditor.InnerBlocks, {
                    allowedBlocks: [
                        'core/columns', 'core/group', 'core/heading', 'core/paragraph', 'core/list', 'core/buttons', 'core/spacer'
                    ],
                    template: [
                        [ 'core/heading', {level: 3, textAlign: 'center'} ]
                    ],
                    templateLock: false,
                }),
				el( wp.element.Fragment, // sidebar
					{},
					el( wp.blockEditor.InspectorControls, {},
						el( wp.components.PanelBody, { className: `${prefix}main`, style },
							el( wp.components.RangeControl, {
								label: 'Block Width (px)',
								value: props.attributes.blockWidth || attributes.blockWidth.default,
								onChange: value => {
									props.setAttributes( { blockWidth: value } );
								},
								min: 720,
								max: 1140
							}),
							el( ...mediaBox(0) ),
						)
					),
				)
			);
		},
		save: props => {
			const imageId = props.attributes.images[0]?.id;
			const imageSizes = wp.data.select('core').getMedia(imageId)?.media_details?.sizes;
			const srcSet = [];
		
			if (imageSizes) {
				for (const size in imageSizes) {
					const imageUrl = imageSizes[size].source_url;
					const imageSize = imageSizes[size].width;
					srcSet.push(`${imageUrl} ${imageSize}w`);
				}
			}
		
			const image = props.attributes.images[0]?.url
				? el('img', { src: props.attributes.images[0].url, srcset: srcSet.join(', '), sizes: '100vw', alt: 'Side image' })
				: null;
		
			const span = image && !props.attributes.link
				? el('span', { className: `${prefix}image` }, image)
				: null;
		
			let style = {};
			if (props.attributes.blockWidth) { style['--blockWidth'] = `${props.attributes.blockWidth}px`; }
			return el('div',
				{ className: `${prefix}main`, style },
				span,
				el(wp.blockEditor.InnerBlocks.Content),
			);
		},		
	} );
})();