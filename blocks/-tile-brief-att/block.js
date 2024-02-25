( function() {

	var el = wp.element.createElement;
    var TextControl = wp.components.TextControl;

	wp.blocks.registerBlockType( 'fcp-gutenberg/tile-brief-attr', {
		title: 'FCP Brief Attrs',
        icon: 'columns',
		category: 'widgets',
		parent: [ 'fcp-gutenberg/tile-brief' ],

		attributes: {
			attr: {
				type: 'string'
			},
			valu: {
				type: 'string'
			}
		},

		edit: function( props ) {
            
			return el( 'div', { className: 'fcp-tile-brief-content' },
                el( TextControl, {
                    placeholder: 'Attribute',
                    value: props.attributes.attr ? props.attributes.attr : '',
                    onChange: function( value ) {
						props.setAttributes( { attr: value } );
					}
                }),
                el( TextControl, {
                    placeholder: 'Value',
                    value: props.attributes.valu ? props.attributes.valu : '',
                    onChange: function( value ) {
						props.setAttributes( { valu: value } );
					}
                })                
			);
		},
		save: function( props ) {
            return null;
		}
	} );
})();