( function( blocks, editor, element, components, _ ) {
	var el = element.createElement;
	var RichText = editor.RichText;
	var MediaUpload = editor.MediaUpload;

	blocks.registerBlockType( 'fcp-gutenberg/review-divider', {
		title: 'FCP Review Divider',
        icon: 'tagcloud',
        category: 'widgets',

		attributes: {
			title: {
				type: 'string',
			},
			content: {
				type: 'string',
			},
			date: {
				type: 'string',
			},
			rating: {
				type: 'string',
			},
			link: {
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
                    'FCP Review Divider'
                ),
				el( RichText, {
					tagName: 'h4',
					inline: true,
					placeholder: 'Review Headline',
					value: attributes.title,
					onChange: function( value ) {
						props.setAttributes( { title: value } );
					},
                    formattingControls: null,
				} ),
				el( RichText, {
					tagName: 'div',
					inline: false,
					placeholder: 'Review Content',
					value: attributes.content,
					onChange: function( value ) {
						props.setAttributes( { content: value } );
					},
                    formattingControls: ['bold', 'italic'],
				} ),
				el( RichText, {
					tagName: 'div',
					inline: true,
					placeholder: 'Review Date',
					value: attributes.date,
					onChange: function( value ) {
						props.setAttributes( { date: value } );
					},
                    formattingControls: null,
				} ),
				el( RichText, {
					tagName: 'div',
					inline: true,
					placeholder: 'Review Rating',
					value: attributes.rating,
					onChange: function( value ) {
						props.setAttributes( { rating: value } );
					},
                    formattingControls: null,
				} ),
				el( RichText, {
					tagName: 'div',
					inline: true,
					placeholder: 'Review Link (start with http..)',
					value: attributes.link,
					onChange: function( value ) {
						props.setAttributes( { link: value } );
					},
                    formattingControls: null,
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
