( function() {

	const el = wp.element.createElement;
	const InnerBlocks = wp.blockEditor.InnerBlocks;
    const defaults = {
        columns: 2,
        mainColor: '#1e293b',
        subColor: '#ffffff'
    };

	wp.blocks.registerBlockType( 'fcp-gutenberg/group-tiles', {
		title: 'FCP Group Tiles',
        icon: 'columns',
		category: 'widgets',

		attributes: {
			columns: {
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
            const applyStyles = function() {
                let styles = {};
                styles['--color-main'] = props.attributes.mainColor || defaults.mainColor;
                styles['--color-sub'] = props.attributes.subColor || defaults.subColor;
                return styles;
            };
			return el( 'div', {},

                el( 'div', {
                        'data-rows': ( props.attributes.columns || defaults.columns ),
                        className: 'fcp-group-tiles',
                        style: applyStyles()
                    },
                    el( InnerBlocks, {
                        allowedBlocks: [
                            'fcp-gutenberg/tile-team-member'
                        ],
                        template: [
                            [ 'fcp-gutenberg/tile-team-member', {} ],
                            [ 'fcp-gutenberg/tile-team-member', {} ]
                        ],
                        templateLock: false
                    })
                ),

                el( wp.blockEditor.InspectorControls, {},
                    el( wp.components.Panel, {},
                        el( wp.components.PanelBody, { title: 'Columns settings', initialOpen: true },
                            el( 'div', {},
                                el( wp.components.RangeControl, {
                                    label: 'Columns',
                                    value: props.attributes.columns || defaults.columns,
                                    onChange: function( value ) {
                                        props.setAttributes( { columns: value } );
                                    },
                                    min: 2,
                                    max: 6
                                }),
                            )
                        ),
                        el( wp.components.PanelBody, { title: 'Primary color', initialOpen: false, icon:
                            el( wp.components.ColorIndicator, { colorValue: props.attributes.mainColor || defaults.mainColor } )
                        },
                            el( 'div', {},
                                el( wp.components.ColorPicker, {
                                    color: props.attributes.mainColor || defaults.mainColor,
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
                            el( wp.components.ColorIndicator, { colorValue: props.attributes.subColor || defaults.subColor } )
                        },
                            el( 'div', {},
                                el( wp.components.ColorPicker, {
                                    color: props.attributes.subColor || defaults.subColor,
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
			return el( InnerBlocks.Content );
		},
	} );
})();