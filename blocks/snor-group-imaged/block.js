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
			align: {
				type: 'string',
				default: 'full',
			},
			size: {
				type: 'number',
				default: 50
			},
			left: {
				type: 'number',
				default: 0
			},
			leftAdd: {
				type: 'number',
				default: 0
			},
			top: {
				type: 'number',
				default: 0
			},
			topAdd: {
				type: 'number',
				default: 0
			},
			transitX: {
				type: 'number',
				default: 0
			},
			transitY: {
				type: 'number',
				default: 0
			}
		},

        supports: {
			align: ['wide', 'full'],
			color: {
				gradients: true,
			},
			spacing: {
				margin: ['top', 'bottom'],
				padding: true,
			},
			__experimentalBorder: {
				radius: true,
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
			if ( props.attributes.size ) { style['--size'] = `${props.attributes.size}%`; }
            if ( props.attributes.left ) { style['--left'] = `${props.attributes.left}%`; }
			if ( props.attributes.top ) { style['--top'] = `${props.attributes.top}%`; }
            if ( props.attributes.leftAdd ) { style['--leftAdd'] = `${props.attributes.leftAdd}px`; }
			if ( props.attributes.topAdd ) { style['--topAdd'] = `${props.attributes.topAdd}px`; }
			if ( props.attributes.transitX ) { style['--transitX'] = `${props.attributes.transitX}%`; }
			if ( props.attributes.transitY ) { style['--transitY'] = `${props.attributes.transitY}%`; }
			return el( 'div',
				{ className: `${props.className} ${prefix}main`, style },
				el( wp.blockEditor.InnerBlocks, {}),
				props.attributes.images[0]?.url
					? el('span', { className: `${prefix}img-holder` }, el( 'img', {src: props.attributes.images[0]?.url} ))
					: null,
				el( wp.element.Fragment, // sidebar
					{},
					el( wp.blockEditor.InspectorControls, {},
						el( wp.components.PanelBody, { className: `${prefix}main`, style },
							el( wp.components.RangeControl, {
								label: 'Size %',
								value: props.attributes.size || 0,
								onChange: value => {
									props.setAttributes( { size: value } );
								},
								min: 0,
								max: 100
							}),
							el( wp.components.RangeControl, {
								label: 'X position %',
								value: props.attributes.left || 0,
								onChange: value => {
									props.setAttributes( { left: value } );
								},
								min: -10,
								max: 110
							}),
							el( wp.components.RangeControl, {
								label: 'X position add px',
								value: props.attributes.leftAdd || 0,
								onChange: value => {
									props.setAttributes( { leftAdd: value } );
								},
								min: -100,
								max: 100
							}),
							el( wp.components.RangeControl, {
								label: 'Y position %',
								value: props.attributes.top || 0,
								onChange: value => {
									props.setAttributes( { top: value } );
								},
								min: -10,
								max: 110
							}),
							el( wp.components.RangeControl, {
								label: 'Y position add px',
								value: props.attributes.topAdd || 0,
								onChange: value => {
									props.setAttributes( { topAdd: value } );
								},
								min: -100,
								max: 100
							}),
							el( wp.components.RangeControl, {
								label: 'Crop X %',
								value: props.attributes.transitX || 0,
								onChange: value => {
									props.setAttributes( { transitX: value } );
								},
								min: -100,
								max: 100
							}),
							el( wp.components.RangeControl, {
								label: 'Crop Y %',
								value: props.attributes.transitY || 0,
								onChange: value => {
									props.setAttributes( { transitY: value } );
								},
								min: -100,
								max: 100
							}),
							el( ...mediaBox(0) ),
						)
					),
				)
			);
		},
		save: props => {
			const image = props.attributes.images[0]?.url
				? el( 'img', { src: props.attributes.images[0].url, alt: 'Background image', title: 'Background image' } )
				: null;
			const span = image && !props.attributes.link
				? el( 'span', { className: `${prefix}img-holder` }, image )
				: null;

			let style = {};
			if ( props.attributes.size ) { style['--size'] = `${props.attributes.size}%`; }
            if ( props.attributes.left ) { style['--left'] = `${props.attributes.left}%`; }
			if ( props.attributes.top ) { style['--top'] = `${props.attributes.top}%`; }
            if ( props.attributes.leftAdd ) { style['--leftAdd'] = `${props.attributes.leftAdd}px`; }
			if ( props.attributes.topAdd ) { style['--topAdd'] = `${props.attributes.topAdd}px`; }
			if ( props.attributes.transitX ) { style['--transitX'] = `${props.attributes.transitX}%`; }
			if ( props.attributes.transitY ) { style['--transitY'] = `${props.attributes.transitY}%`; }
			return el( 'div',
				{ className: `${prefix}main`, style },
                el( wp.blockEditor.InnerBlocks.Content ),
				span,
            );
		},
	} );
})();