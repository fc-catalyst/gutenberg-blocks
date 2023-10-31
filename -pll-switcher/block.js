(() => {
	const el = wp.element.createElement;

	wp.blocks.registerBlockType( 'fct-gutenberg/pll-switcher', {
		title: 'FCT PLL Switcher',
        icon: 'block-default',
		category: 'widgets',
		edit: props => {
			return el(
				'nav',
				{ className: props.className + ' wp-block-navigation' },
				el(
					'span',
					{},
					'LANGUAGE'
				)
			);
		},
		save: () => {
            return null;
		}
	} );
} )();
