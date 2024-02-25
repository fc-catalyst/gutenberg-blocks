( function( blocks, element, blockEditor ) {
	var el = element.createElement;
	var RichText = blockEditor.RichText;
    var InnerBlocks = blockEditor.InnerBlocks;

	blocks.registerBlockType( 'fcp-gutenberg/surgeries', {
		title: 'FCP Surgeries Tile',
        icon: 'tagcloud',
        category: 'widgets',

		attributes: {
			title: {
				type: 'string'
			},
			link: {
				type: 'string'
			},
			content: {
				type: 'string'
			}
		},

		edit: function( props ) {
			var attributes = props.attributes;

			return el(
				'div',
				{ className: 'fcp-surg-tile' },

                el( RichText, {
					tagName: 'div',
					multiline: [false],
					placeholder: 'The Tile Title',
                    className: 'fcp-surg-tile-title',
					value: attributes.title,
					onChange: function( value ) {
						props.setAttributes( { title: value } );
					},
                    allowedFormats: []
				} ),
				el( InnerBlocks, {
                    className: 'fcp-surg-tile-content',
                    template: [
                        [ 'core/paragraph', {
                            placeholder: 'The following layout is just an example, which can be changed. The original design, though, looks like this.'
                        } ],
                        [ 'core/heading', {
                            placeholder: 'The surgeries list headline',
                            level: 3
                        } ],
                        [ 'core/paragraph', {
                            content: '<a href="#">Surgery 1 link</a>'
                        } ],
                        [ 'core/paragraph', {
                            content: '<a href="#">Surgery 2 link</a>'
                        } ]
                    ],
                    templateLock: false

                } ),
				el( RichText, {
					tagName: 'div',
					multiline: [false],
					placeholder: 'Read More Link >',
                    className: 'fcp-surg-tile-link',
					value: attributes.link,
					onChange: function( value ) {
						props.setAttributes( { link: value } );
					},
                    allowedFormats: []
				} ),
			);
		},

		save: function( props ) {
			return el(
				'div',
				{},
				el( InnerBlocks.Content )
			);
		},
	} );
} )(
	window.wp.blocks,
	window.wp.element,
	window.wp.blockEditor
);
