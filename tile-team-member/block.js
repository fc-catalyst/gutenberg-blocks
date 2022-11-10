( function() {

	var el = wp.element.createElement;
    var MediaUpload = wp.blockEditor.MediaUpload;
    var TextControl = wp.components.TextControl;

	wp.blocks.registerBlockType( 'fcp-gutenberg/tile-team-member', {
		title: 'FCP Tile Team Member',
        icon: 'users',
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

			var onSelectImage = function( media ) {
				return props.setAttributes( {
					mediaURL: media.sizes && media.sizes.thumbnail ? media.sizes.thumbnail.url : media.url,
					mediaID: media.id
				});
			};
            
			return el( 'div', { className: 'fcp-tile-team-member' },
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
                el( 'div', { className: 'fcp-tile-team-member-header' },
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
			);
		},
		save: function( props ) {
            return null;
		}
	} );
})();
