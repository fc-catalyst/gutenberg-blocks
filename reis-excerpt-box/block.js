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
		},

        supports: {
			color: {
				gradients: true,
			},
			spacing: {
				margin: ['top', 'bottom'],
				padding: true,
			},
        },

		edit: props => {

			return el( 'div',
				{
					className: `${props.className} ${prefix}main has-background has-secondary-back-gradient-background`,
					style: {paddingTop: `var(--wp--preset--spacing--30)`, paddingRight: `var(--wp--preset--spacing--30)`, paddingBottom: `var(--wp--preset--spacing--30)`, paddingLeft: `var(--wp--preset--spacing--30)`},
				},
				el( wp.blockEditor.InnerBlocks, {
                    allowedBlocks: [
                        'core/heading', 'core/image', 'core/paragraph', 'core/button'
                    ],
                    template: [
						[ 'core/heading', {level: 3} ],
						[ 'core/image', {} ],
                        [ 'core/paragraph', {} ],
						[ 'core/button', {className: 'blocks-default'} ],
                    ],
                    templateLock: true
                }),
			);
		},
		save: props => {
            return el( 'div',
				{ className: `${prefix}main` },
                el( wp.blockEditor.InnerBlocks.Content )
            );
		},
	} );
})();