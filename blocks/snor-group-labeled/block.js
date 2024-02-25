(() => {

	const el = wp.element.createElement;


	wp.blocks.registerBlockType( blockName, {
		title,
        icon: iconSrc
			? el('img', {
				src: iconSrc,
				alt: title,
				width: 20,
				height: 20,
			})
			: 'columns',
		category: 'widgets',

		attributes: {
			align: {
				type: 'string',
				default: 'full',
			},
			size: {
				type: 'number',
				default: 30
			},
			left: {
				type: 'number',
				default: 80
			},
			leftAdd: {
				type: 'number',
				default: 0
			},
			top: {
				type: 'number',
				default: 0
			},
			topAdd: {
				type: 'number',
				default: -40
			}
		},

        supports: {
			align: ['wide', 'full'],
			color: {
				gradients: true,
			},
			spacing: {
				margin: ['top', 'bottom'],
				padding: true,
			},
			__experimentalBorder: {
				radius: true,
			},
        },

		edit: props => {

            let style = {};
			if ( props.attributes.size ) { style['--size'] = `${props.attributes.size}%`; }
            if ( props.attributes.left ) { style['--left'] = `${props.attributes.left}%`; }
			if ( props.attributes.top ) { style['--top'] = `${props.attributes.top}%`; }
            if ( props.attributes.leftAdd ) { style['--leftAdd'] = `${props.attributes.leftAdd}px`; }
			if ( props.attributes.topAdd ) { style['--topAdd'] = `${props.attributes.topAdd}px`; }
			return el( 'div',
				{ className: `${props.className} ${prefix}main`, style },
				el( wp.blockEditor.InnerBlocks, {
					template: [
						['core/group', {}, [
							['core/paragraph', { content: 'The block content' }],
						]],
						['core/group', { className: `${prefix}label`, style:{
								spacing: { padding: { top: "20px", right: "10px", bottom: "20px", left: "10px" } },
								border:{ radius: "8px", width: "1px", style: "solid", color: "red" }
							}}, [
							['core/paragraph', { content: 'Label', align:"center" }],
						]],
					],
					templateLock: false,
                }),
				el( wp.element.Fragment, // sidebar
					{},
					el( wp.blockEditor.InspectorControls, {},
						el( wp.components.PanelBody, { className: `${prefix}main`, style },
							el( wp.components.RangeControl, {
								label: 'Size %',
								value: props.attributes.size || 0,
								onChange: value => {
									props.setAttributes( { size: value } );
								},
								min: 0,
								max: 100
							}),
							el( wp.components.RangeControl, {
								label: 'X position %',
								value: props.attributes.left || 0,
								onChange: value => {
									props.setAttributes( { left: value } );
								},
								min: -10,
								max: 110
							}),
							el( wp.components.RangeControl, {
								label: 'X position add px',
								value: props.attributes.leftAdd || 0,
								onChange: value => {
									props.setAttributes( { leftAdd: value } );
								},
								min: -100,
								max: 100
							}),
							el( wp.components.RangeControl, {
								label: 'Y position %',
								value: props.attributes.top || 0,
								onChange: value => {
									props.setAttributes( { top: value } );
								},
								min: -10,
								max: 110
							}),
							el( wp.components.RangeControl, {
								label: 'Y position add px',
								value: props.attributes.topAdd || 0,
								onChange: value => {
									props.setAttributes( { topAdd: value } );
								},
								min: -100,
								max: 100
							}),
						)
					),
				)
			);
		},
		save: props => {

			let style = {};
			if ( props.attributes.size ) { style['--size'] = `${props.attributes.size}%`; }
            if ( props.attributes.left ) { style['--left'] = `${props.attributes.left}%`; }
			if ( props.attributes.top ) { style['--top'] = `${props.attributes.top}%`; }
            if ( props.attributes.leftAdd ) { style['--leftAdd'] = `${props.attributes.leftAdd}px`; }
			if ( props.attributes.topAdd ) { style['--topAdd'] = `${props.attributes.topAdd}px`; }
			return el( 'div',
				{ className: `${prefix}main`, style },
                el( wp.blockEditor.InnerBlocks.Content ),
            );
		},
	} );
})();