( function() {

	const el = wp.element.createElement;
    const MediaUpload = wp.blockEditor.MediaUpload;
    const TextControl = wp.components.TextControl;
    const Spacer = wp.components.__experimentalSpacer;

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
			name: {
				type: 'string'
			},
			url: {
				type: 'string'
			}
		},

		edit: function( props ) {

			const onSelectImage = function( media ) {
				return props.setAttributes( {
					mediaURL: media.sizes && media.sizes.thumbnail ? media.sizes.thumbnail.url : media.url,
					mediaID: media.id
				});
			};
            const onRemoveImage = function() {
				return props.setAttributes( {
					mediaURL: '',
					mediaID: ''
				});
            };
            
			return el( 'div', {},

                el( 'div', { className: 'fcp-tile-team-member' },
                    el( 'div', { className: 'fcp-tile-team-member-image' },
                    props.attributes.mediaID &&
                        el( 'img', { src: props.attributes.mediaURL } ),
                    ),
                    el( 'div', { className: 'fcp-tile-team-member-header' },
                        props.attributes.name
                    ),
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
                                                el( 'img', { src: props.attributes.mediaURL } ),
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
                                            )
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
                                    placeholder: 'Link',
                                    value: props.attributes.url ? props.attributes.url : '',
                                    onChange: function( value ) {
                                        props.setAttributes( { url: value } );
                                    }
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
