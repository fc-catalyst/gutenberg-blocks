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
		supports: {
			html: false,
		},

		edit: props => {
			return el(
				'div',
				{ className: `${props.className} ${prefix}main` },
				el(wp.blockEditor.InnerBlocks, {
					allowedBlocks: ['fc-gutenberg-blocks/lanuwa-tabs-tab'],
					template: [
						['fc-gutenberg-blocks/lanuwa-tabs-tab', {}],
						['fc-gutenberg-blocks/lanuwa-tabs-tab', {}],
					],
					templateLock: false,
				})
			);
		},

		save: () => {
			return el(wp.blockEditor.InnerBlocks.Content);
		},
	});
})();
