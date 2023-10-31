(() => {

    /* add click/hover/none behavior, add button (with text) option, remove max-height and overall opening alg?, default button with no text - use no text */
    /* add option to hide button if click and show if hover????? */

	const el = wp.element.createElement;

    
	wp.blocks.registerBlockType( blockModName, {
		title: 'FCT Cropped Height',
        icon: 'columns',
		category: 'widgets',

		attributes: {
			height: {
				type: 'number'
			},
            behavior: {
                type: 'string'
            },
            showButton: {
                type: 'boolean'
            },
            buttonText: {
                type: 'string'
            }
		},

		edit: props => {
            let style = {};
            if ( props.attributes.height ) { style['--height'] = `${props.attributes.height}px`; }
            if ( !props.attributes.showButton ) { style['--button-bias'] = 0; }
            if ( props.attributes.buttonText ) { style['--button-text'] = `"${props.attributes.buttonText}"`; }
			return el( 'div',
				{ className: `${props.className} ${prefix}main`, style },
				el( wp.blockEditor.InnerBlocks, {
/*                    allowedBlocks: [
                        'core/heading', 'core/paragraph', 'core/list', 'core/image', 'core/button', 'core/buttons', 'core/table', 'core/separator'
                    ], //*/
                    template: [
                        [ 'core/heading', {} ],
                        [ 'core/paragraph', {} ]
                    ],
                    templateLock: false
                }),
                props.attributes.showButton ? el( 'button', {},
                    props.attributes.buttonText
                ) : null,
                el( // sidebar
                    wp.element.Fragment,
                    {},
                    el( wp.blockEditor.InspectorControls, {},
                        el( wp.components.PanelBody, {},
                            el( wp.components.RangeControl, {
                                label: 'Crop height (px)',
                                value: props.attributes.height || 300,
                                onChange: value => {
                                    props.setAttributes( { height: value } );
                                },
                                min: 100,
                                max: 800
                            }),
                            el(wp.components.SelectControl, {
                                label: 'Behavior',
                                value: props.attributes.behavior,
                                options: [
                                    { value: 'none', label: 'Just crop to height' },
                                    { value: 'hover', label: 'Open on Hover', disabled: true }, // ++
                                    { value: 'click', label: 'Open on Click', disabled: true }, // ++
                                ],
                                onChange: value => {
                                    props.setAttributes( { behavior: value } );
                                },
                            }),    
                            el( wp.components.ToggleControl, {
                                label: 'Show Button',
                                checked: props.attributes.showButton || false,
                                onChange: value => {
                                    props.setAttributes( { showButton: value } );
                                }
                            }),
                            props.attributes.showButton ? el( wp.components.TextControl, {
                                label: 'Button Text',
                                //placeholder: 'Expand',
                                value: props.attributes.buttonText,
                                onChange: value => {
                                    props.setAttributes( { buttonText: value } );
                                }
                            }) : null
                        )
                    )
                )
			);
		},
		save: props => {
			return el( wp.blockEditor.InnerBlocks.Content );
		},
	} );
})();