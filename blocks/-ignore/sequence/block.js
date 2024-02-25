( function( blocks, editor, element, components, _ ) {
	var el = element.createElement;
	var RichText = editor.RichText;
	var MediaUpload = editor.MediaUpload;

	blocks.registerBlockType( 'fcp-gutenberg/sequence', {
		title: 'FCP Sequence',
        icon: 'editor-ol',
        category: 'widgets',

		attributes: {
			number: {
				type: 'string',
			},
			title: {
				type: 'string',
			},
			content: {
				type: 'string',
			},
		},

		edit: function( props ) {
			var attributes = props.attributes;

			return el(
				'div',
				{},
                el(
                    'h3',
                    {},
                    'FCP Sequence'
                ),
				el( RichText, {
					tagName: 'h4',
					inline: true,
					placeholder: 'Order Number',
					value: attributes.number,
					onChange: function( value ) {
						props.setAttributes( { number: value } );
					},
                    formattingControls: null,
				} ),
				el( RichText, {
					tagName: 'h5',
					inline: false,
					placeholder: 'Headline',
					value: attributes.title,
					onChange: function( value ) {
						props.setAttributes( { title: value } );
					},
                    formattingControls: null,
				} ),
				el( RichText, {
					tagName: 'div',
					inline: true,
					placeholder: 'Content',
					value: attributes.content,
					onChange: function( value ) {
						props.setAttributes( { content: value } );
					},
                    formattingControls: ['bold', 'italic', 'link'],
				} ),
			);
		},
		save: function( props ) {
            return null;
		},
	} );
} )(
	window.wp.blocks,
	window.wp.editor,
	window.wp.element,
	window.wp.components,
	window._
);
