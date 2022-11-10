( function() {

	var el = wp.element.createElement;
    var MediaUpload = wp.blockEditor.MediaUpload;
    var InnerBlocks = wp.blockEditor.InnerBlocks;
    var TextControl = wp.components.TextControl;

	wp.blocks.registerBlockType( 'fcp-gutenberg/tile-brief', {
		title: 'FCP Tile Brief',
        icon: 'tagcloud',
		category: 'widgets',

		attributes: {
			mediaID: {
				type: 'number'
			},
			mediaURL: {
				type: 'string'
			},
			headlinePre: {
				type: 'string'
			},
			headline: {
				type: 'string'
			}
		},

		edit: function( props ) {

			var onSelectImage = function( media ) {
				return props.setAttributes( {
					mediaURL: media.sizes && media.sizes.thumbnail ? media.sizes.thumbnail.url : media.url,
					mediaID: media.id
				});
			};
            
			return el( 'div', { className: 'fcp-tile-brief' },
                el( MediaUpload, {
                    onSelect: onSelectImage,
                    allowedTypes: 'image',
                    value: props.attributes.mediaID,
                    render: function( obj ) {
                        return el( wp.components.Button,
                            {
                                onClick: obj.open,
                            },
                            ! props.attributes.mediaID
                                ? 'Upload Image'
                                : el( 'img', { src: props.attributes.mediaURL } )
                        );
                    }
                }),
                el( 'div', { className: 'fcp-tile-brief-header' },
                    el( TextControl, {
                        placeholder: 'Pre-Headline',
                        value: props.attributes.headlinePre ? props.attributes.headlinePre : '',
                        onChange: function( value ) {
                            props.setAttributes( { headlinePre: value } );
                        }
                    }),
                    el( TextControl, {
                        placeholder: 'Headline',
                        value: props.attributes.headline ? props.attributes.headline : '',
                        onChange: function( value ) {
                            props.setAttributes( { headline: value } );
                        }
                    })
                ),
                el( 'div',
				    {},
				    el( InnerBlocks, {
                        allowedBlocks: [
                            'fcp-gutenberg/tile-brief-attr'
                        ],
                        template: [
                            [ 'fcp-gutenberg/tile-brief-attr', {} ],
                            [ 'fcp-gutenberg/tile-brief-attr', {} ]
                        ],
                        templateLock: false
                    })
                )
			);
		},
		save: function( props ) {
            return el( InnerBlocks.Content );
		}
	} );
})();
