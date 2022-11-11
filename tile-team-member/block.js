( function() {

	const el = wp.element.createElement;
    const MediaUpload = wp.blockEditor.MediaUpload;
    const TextControl = wp.components.TextControl;
    const SelectControl = wp.components.SelectControl;
    const Spacer = wp.components.__experimentalSpacer;
    const RangeControl = wp.components.RangeControl;

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
            
			return el( 'div', {},

                el( 'div', { className: 'fcp-tile-team-member', style: { paddingBottom: ( props.attributes.height || 110 ) + '%' } },
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
                        el( 'img', { src: props.attributes.mediaURL || props.attributes.mediaThumbnailURL } ),
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
                                    label: 'Height in % of width',
                                    value: props.attributes.height || 110,
                                    onChange: function( value ) {
                                        props.setAttributes( { height: value } );
                                    },
                                    min: 70,
                                    max: 150
                                })
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


// ++groups set up / style properly, color1, color2
    //++maybe set primaty & secondary colors to group to ingerit by tiles
        //++unique ids
// ++class name from index.php
// ++filter the blocks, fed to the editor.js by index.php
// ++default image
// ++add background image icon to empty content