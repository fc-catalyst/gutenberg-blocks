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
		},

        supports: {
			color: {
				gradients: true,
			},
        },

		edit: props => {

			const onSelectImage = (media, ind) => {
                const images = [...props.attributes.images];
                const newImage = {
                    id: media.id,
                    url: media.url,
					thumbnail: media.sizes.thumbnail ? media.sizes.thumbnail.url : media.url,
                    caption: images[ind]?.caption || '',
                };
                images[ind] = newImage;
                props.setAttributes({ images });
			};

            const mediaBox = ind => {
                const images = [...props.attributes.images];
                const mediaID = images[ind]?.id || 0;
                //const mediaURL = images[ind]?.url || '';
				const mediaThumbnail = images[ind]?.thumbnail || '';
                const mediaCaption = images[ind]?.caption || '';
                return [
                    'figure',
                    {},
                    el( MediaUpload, {
                        onSelect: media => { onSelectImage(media, ind) },
                        allowedTypes: 'image',
                        value: mediaID,
                        render: obj => {
                            return el(
                                Button,
                                {
                                    type: 'button',
                                    className: 'select',
                                    onClick: obj.open,
                                },
                                mediaID
                                    ? el( 'img', { src: mediaThumbnail } )
                                    : el( 'span', {}, 'Image' ),
                                mediaID
                                    ? el( 'button', { type: 'button', className: 'clear', onClick: e => {
                                        e.stopPropagation();
                                        images[ind].id = 0;
                                        images[ind].url = '';
                                        props.setAttributes({ images });
                                      }}, '+' )
                                    : null,
                            );
                        },
                    }),
                    el( RichText, {
                        tagName: 'figcaption',
                        placeholder: 'Caption',
                        value: mediaCaption,
                        onChange: value => {
                            const images = [...props.attributes.images];
                            images[ind].caption = value;
                            props.setAttributes({ images });
                        },
                        allowedFormats: ['core/bold', 'core/italic']
                    })
                ];

            };

			return el( 'div',
				{ className: `${props.className} ${prefix}main` },
				el( ...mediaBox(0) ),
				el( wp.blockEditor.InnerBlocks, {
                    allowedBlocks: [
                        'core/heading', 'core/paragraph', 'core/list'
                    ],
                    template: [
                        [ 'core/heading', {} ],
						[ 'core/paragraph', {} ]
                    ],
                    templateLock: false
                }),
			);
		},
		save: props => {
            return el( 'div',
				{ className: `${prefix}main` },
				images[0].url
					? el( 'img', { src: images[0].url, alt: 'Badge' } )
					: null,
                el( wp.blockEditor.InnerBlocks.Content )
            );
		},
	} );
})();