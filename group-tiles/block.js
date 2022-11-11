( function() {

	var el = wp.element.createElement;
	var InnerBlocks = wp.blockEditor.InnerBlocks;

	wp.blocks.registerBlockType( 'fcp-gutenberg/group-tiles', {
		title: 'FCP Group Tiles',
        icon: 'columns',
		category: 'widgets',

		attributes: {
			columns: {
				type: 'number'
			}
		},

		edit: function( props ) {
            var initial = props.attributes.columns ? props.attributes.columns : 2;
			return el( 'div',
				{ 'data-rows': initial, className: 'fcp-group-tiles' },
				el( InnerBlocks, {
                    allowedBlocks: [
                        'fcp-gutenberg/tile-team-member'
                    ],
                    template: [
                        [ 'fcp-gutenberg/tile-team-member', {} ],
                        [ 'fcp-gutenberg/tile-team-member', {} ]
                    ],
                    templateLock: false
                }),
                el( wp.blockEditor.InspectorControls, {},
                    el( wp.components.Panel, {},
                        el( wp.components.PanelBody, { title: 'Columns settings', initialOpen: true },
                            el( 'div', {},
                                el( wp.components.RangeControl, {
                                    label: 'Columns',
                                    value: initial,
                                    onChange: function( value ) {
                                        props.setAttributes( { columns: value } );
                                    },
                                    min: 2,
                                    max: 6
                                })
                            )
                        )
                    )
                )
			);
		},
		save: function( props ) {
			return el( InnerBlocks.Content );
		},
	} );
})();