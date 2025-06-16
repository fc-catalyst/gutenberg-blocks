(() => {

	const el = wp.element.createElement;
    const attributes = {
        tabLabel: {
            type: 'string',
            default: '',
        },
    };

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
        parent: ['fc-gutenberg-blocks/lanuwa-tabs'],
		
        attributes,

		edit: props => {
			const { attributes, setAttributes } = props;

			return el(
				'div',
				{ className: `${props.className} ${prefix}main` },
				el(wp.components.TextControl, {
					placeholder: 'Tab Label',
					value: attributes.tabLabel,
					onChange: value => setAttributes({ tabLabel: value }),
				}),
				el(wp.blockEditor.InnerBlocks)
			);
		},

		save: props => {
			return el(wp.blockEditor.InnerBlocks.Content);
		},
	});
})();
