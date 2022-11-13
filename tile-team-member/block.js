( function() {

	const el = wp.element.createElement;
    const MediaUpload = wp.blockEditor.MediaUpload;
    const TextControl = wp.components.TextControl;
    const SelectControl = wp.components.SelectControl;
    const Spacer = wp.components.__experimentalSpacer;
    const RangeControl = wp.components.RangeControl;

    const defaults = {
        height: 110
    };

	wp.blocks.registerBlockType( 'fcp-gutenberg/tile-team-member', {
		title: 'FCP Tile Team Member',
        icon: 'columns',
		category: 'widgets',

		attributes: {
			mediaID: {
				type: 'number'
			},
			mediaURL: {
				type: 'string'
			},
			mediaThumbnailURL: {
				type: 'string'
			},
            mediaSize: {
                type: 'string'
            },
            mediaSizes: {
                type: 'array'
            },
			name: {
				type: 'string'
			},
            description: {
				type: 'string'
			},
			url: {
				type: 'string'
			},
            height: {
				type: 'number'
			},
            mainColor: {
                type: 'string'
            },
            subColor: {
                type: 'string'
            }
		},

		edit: function( props ) {

			const onSelectImage = function( media ) {
				return props.setAttributes( {
					mediaURL: media.sizes?.thumbnail?.url || media.url,
                    mediaThumbnailURL: media.sizes?.thumbnail?.url || media.url,
					mediaID: media.id,
                    mediaSizes: Object.keys( media.sizes ).map( v => { return { label: v, value: v, url: media.sizes[v].url } } ),
                    mediaSize: ''
				});
			};
            const onRemoveImage = function() {
				return props.setAttributes( {
					mediaURL: '',
                    mediaThumbnailURL: '',
					mediaID: '',
                    mediaSizes: [],
                    mediaSize: ''
				});
            };
            const applyStyles = function() {
                let styles = {};
                styles.paddingBottom = ( props.attributes.height || defaults.height ) + '%';
                styles['--color-main'] = props.attributes.mainColor || '';
                styles['--color-sub'] = props.attributes.subColor || '';
                return styles;
            };
            
			return el( 'div', {},

                el( 'div', { className: 'fcp-tile-team-member', style: applyStyles() },
                    el( 'div', { className: 'fcp-tile-team-member-link' },
                        el( 'div', { className: 'fcp-tile-team-member-content' },
                            props.attributes.name &&
                            el( 'span', {}, props.attributes.name ),
                            props.attributes.description &&
                            el( 'p', {}, props.attributes.description )
                        )
                    ),
                    el( 'div', { className: 'fcp-tile-team-member-image' },
                        props.attributes.mediaID &&
                        el( 'img', { src: props.attributes.mediaURL || props.attributes.mediaThumbnailURL } ) ||
                        el( 'img', {
                                src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cg fill='none' stroke='%23b3b3b3' stroke-width='.1'%3E%3Ccircle r='3.7' cy='4.3' cx='8' /%3E%3Cpath d='m 10,9 c -1.5,0.7 -2.8,0.7 -4,0 -3,0 -4.3,2.1 -4.4,3.9 v 1.22 c 0,0.8 0.6,1.4 1.4,1.4 H 13 c 0.8,0 1.4,-0.6 1.4,-1.4 v -1.2 c 0,-1.8 -1.7,-3.9 -4.4,-3.94 z' /%3E%3C/g%3E%3C/svg%3E",
                                style: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }
                            } ),
                    )
                ),
            
                el( wp.blockEditor.InspectorControls, {},
                    el( wp.components.Panel, {},
                        el( wp.components.PanelBody, { title: 'About the person', initialOpen: true },
                            el( 'div', {},

                                el( MediaUpload, {
                                    onSelect: onSelectImage,
                                    allowedTypes: 'image',
                                    value: props.attributes.mediaID,
                                    render: function( obj ) {
                                        return el( 'div', {},
                                            props.attributes.mediaID &&
                                            el( wp.components.Button,
                                                {
                                                    className: 'editor-post-featured-image__preview',
                                                    onClick: obj.open,
                                                },
                                                el( Spacer, { marginBottom: 5 } ),
                                                el( 'img', { src: props.attributes.mediaThumbnailURL } ),
                                                el( Spacer, { marginBottom: 5 } )
                                            ),
                                            el( wp.components.PanelRow, {},
                                                el( wp.components.Button,
                                                    {
                                                        className: 'is-secondary',
                                                        onClick: obj.open,
                                                    },
                                                    'Upload / Select the photo'
                                                ),
                                                props.attributes.mediaID &&
                                                el( wp.components.Button, {
                                                    className:'is-link is-destructive',
                                                    onClick: onRemoveImage
                                                    },
                                                    'Remove'
                                                )
                                            ),
                                            !!props.attributes.mediaSizes?.length &&
                                            el( SelectControl, {
                                                value: props.attributes.mediaSize,
                                                onChange: function( value ) {
                                                    props.setAttributes( {
                                                        mediaSize: value,
                                                        mediaURL: props.attributes.mediaSizes.find( v => v.value === value )?.url
                                                    });
                                                },
                                                options: [{ label: 'Choose the size', value: '' }].concat( props.attributes.mediaSizes )
                                            }),
                                        );
                                    }
                                }),
                                el( Spacer, { marginBottom: 6 } ),
                                el( TextControl, {
                                    placeholder: 'Name',
                                    value: props.attributes.name ? props.attributes.name : '',
                                    onChange: function( value ) {
                                        props.setAttributes( { name: value } );
                                    }
                                }),
                                el( TextControl, {
                                    placeholder: 'About',
                                    value: props.attributes.description ? props.attributes.description : '',
                                    onChange: function( value ) {
                                        props.setAttributes( { description: value } );
                                    }
                                }),
                                el( TextControl, {
                                    placeholder: 'Link',
                                    value: props.attributes.url ? props.attributes.url : '',
                                    onChange: function( value ) {
                                        props.setAttributes( { url: value } );
                                    }
                                }),
                                el( RangeControl, {
                                    label: 'Height %',
                                    value: props.attributes.height || defaults.height,
                                    onChange: function( value ) {
                                        props.setAttributes( { height: value } );
                                    },
                                    min: 70,
                                    max: 200
                                })
                            )
                        ),
                        el( wp.components.PanelBody, { title: 'Primary color', initialOpen: false, icon:
                            el( wp.components.ColorIndicator, { colorValue: props.attributes.mainColor || '' } )
                        },
                            el( 'div', {},
                                el( wp.components.ColorPicker, {
                                    color: props.attributes.mainColor || '',
                                    enableAlpha: true,
                                    onChange: function( value ) {
                                        props.setAttributes( { mainColor: value } );
                                    }
                                }),
                                props.attributes.mainColor &&
                                el( wp.components.Button, {
                                    className:'is-link is-destructive',
                                    onClick: function() {
                                        props.setAttributes( { mainColor: '' } );
                                    }
                                    },
                                    'Clear'
                                )
                            )
                        ),
                        el( wp.components.PanelBody, { title: 'Secondary color', initialOpen: false, icon:
                            el( wp.components.ColorIndicator, { colorValue: props.attributes.subColor || '' } )
                        },
                            el( 'div', {},
                                el( wp.components.ColorPicker, {
                                    color: props.attributes.subColor || '',
                                    enableAlpha: true,
                                    onChange: function( value ) {
                                        props.setAttributes( { subColor: value } );
                                    }
                                }),
                                props.attributes.subColor &&
                                el( wp.components.Button, {
                                    className:'is-link is-destructive',
                                    onClick: function() {
                                        props.setAttributes( { subColor: '' } );
                                    }
                                    },
                                    'Clear'
                                )
                            )
                        )
                    )
                )
			);
		},
		save: function( props ) {
            return null;
		}
	} );
})();