(() => {

	const el = wp.element.createElement;
	//const InnerBlocks = wp.blockEditor.InnerBlocks;
    //const TextControl = wp.components.TextControl;
    const Button = wp.components.Button;
	const RichText = wp.blockEditor.RichText;
	const MediaUpload = wp.blockEditor.MediaUpload;


	wp.blocks.registerBlockType( blockModName, {
		title: 'Decor with Images',
        icon: 'columns',
		category: 'widgets',

		attributes: {
            sepia: {
                type: 'number'
            },
            images: {
                type: 'array',
                default: []
            },
		},

		edit: props => {

			const onSelectImage = (media, ind) => {
                const images = [...props.attributes.images];
                const newImage = {
                    id: media.id,
                    url: media.sizes.thumbnail ? media.sizes.thumbnail.url : media.url,
                    caption: images[ind]?.caption || '',
                };
                images[ind] = newImage;
                props.setAttributes({ images });
			};

            const mediaBox = ind => {
                const images = [...props.attributes.images];
                const mediaID = images[ind]?.id || 0;
                const mediaURL = images[ind]?.url || '';
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
                                    ? el( 'img', { src: mediaURL } )
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
            
            let style = {};
            if ( props.attributes.sepia ) { style['--sepia'] = props.attributes.sepia+'%'; }

			return el(
				'div',
				{ className: props.className+ ' ' +prefix+'main', style },
                el( ...mediaBox(0) ),
                el( ...mediaBox(1) ),
                el( ...mediaBox(2) ),
                el( ...mediaBox(3) ),
                el( // sidebar
                    wp.element.Fragment,
                    {},
                    el( wp.blockEditor.InspectorControls, {},
                        el( wp.components.PanelBody, {},
                            el( wp.components.RangeControl, {
                                label: 'Sepia effect (%)',
                                value: props.attributes.sepia || 0,
                                onChange: value => {
                                    props.setAttributes( { sepia: value } );
                                },
                                min: 0,
                                max: 100
                            })
                        )
                    )
                )
			);
		},
		save: props => {
			return null;//el( InnerBlocks.Content );
		},
	} );
})();

// ++ sidebar to turn on sepia
