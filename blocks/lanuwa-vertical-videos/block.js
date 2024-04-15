(() => {

	const el = wp.element.createElement;
	const attributes = { // to have the access to the default values
		medias: {
			type: 'array',
			default: [],
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

		attributes,

        supports: {
			color: {
				gradients: true,
			},
			spacing: {
				margin: ['top', 'bottom'],
			},
        },
		parent: [blockName+'-group'],

		edit: props => {

			const onSelectImage = (media, ind) => {
                const medias = [...props.attributes.medias];
                const newImage = {
                    id: media.id,
                    url: media.url,
					thumbnail: media.sizes?.large ? media.sizes.large.url : media.url, // .thumbnail
                };
                medias[ind] = newImage;
                props.setAttributes({ medias });
			};

            const mediaBox = (ind, label = 'Image', type = ['image']) => {
                const medias = [...props.attributes.medias];
                const mediaID = medias[ind]?.id || 0;
				const mediaThumbnail = medias[ind]?.thumbnail || medias[ind]?.url;
                return [
                    'figure',
                    {},
                    el( wp.blockEditor.MediaUpload, {
                        onSelect: media => { onSelectImage(media, ind) },
                        allowedTypes: type,
                        value: mediaID,
                        render: obj => {
                            return el(
                                wp.components.Button,
                                {
                                    type: 'button',
                                    className: `select-media ${mediaID || 'empty-media'}`,
                                    onClick: obj.open,
                                },
								type.includes('video')
									? mediaID
										? el( 'span', {className: 'video'}, mediaThumbnail )
										: el( 'span', {}, label )
									: mediaID
										? el( 'img', { src: mediaThumbnail } )
										: el( 'span', {}, label ),
									mediaID
									? el( 'button', { type: 'button', className: 'clear-media', onClick: e => {
										e.stopPropagation();
										medias[ind].id = 0;
										medias[ind].url = '';
										props.setAttributes({ medias });
									}}, '+' )
									: null
                            );
                        },
                    })
                ];

            };

			const video_selected = !!props.attributes.medias[1]?.url;

			return el( 'div',
				{ className: `${props.className} ${prefix}main` },
				el( wp.blockEditor.InnerBlocks, {
                    allowedBlocks: [
                        'core/heading', 'core/paragraph', 'core/list', 'core/buttons', 'core/button', 'core/spacer'
                    ],
                    template: [
                        [ 'core/heading', {level: 3} ],
						[ 'core/paragraph', {} ],
						[ 'core/button', { text: 'Instagram' } ]
                    ],
                    templateLock: false,
                }),
				el( 'div', {className: `video ${video_selected ? `video-selected` : ``}`},
					el( 'div', {}, 
						props.attributes.medias[0]?.url
							? el( 'img', { src: props.attributes.medias[0].url, alt: 'Video Preview' } )
							: el( 'span', {}, video_selected ? 'Video selected' : 'Video not selected' )
					)
				),
				
				el( wp.element.Fragment, // sidebar
					{},
					el( wp.blockEditor.InspectorControls, {},
						el( wp.components.PanelBody, { className: `${prefix}main` },
							el( ...mediaBox(1, 'Video', ['video']) ),
							el( ...mediaBox(0) ),
						)
					),
				)
			);
		},
		save: props => {
			const video = props.attributes.medias[1]?.url
				? el( 'div', { className: `${prefix}video` }, el( 'video',
					{controls: '', preload: 'none', poster: props.attributes.medias[0]?.url || ''},
					el( 'source', {src: props.attributes.medias[1].url} ),
				))
				: null

			return el( 'div',
				{ className: `${prefix}main` },
				el( 'div', 
					{ className: `${prefix}content` },
					el( wp.blockEditor.InnerBlocks.Content ),
				),
				video,
            );
		},
	} );
})();


const group_settings = {prefix: prefix+'group-', blockName: blockName+'-group', title: title+' Group', iconSrc: iconSrc.replace('icon.svg', 'icon-group.svg')};
(() => {

	const {prefix, blockName, title, iconSrc} = group_settings;
	const el = wp.element.createElement;
	const attributes = { // to have the access to the default values
		align: {
			type: 'string',
			default: 'wide',
		},
		columns: {
			type: 'number',
			default: 2,
		},
		layout: {
			type: 'string',
			default: 'horisontal',
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

		attributes,

        supports: {
			align: ['wide'],
			color: {
				gradients: true,
			},
			spacing: {
				margin: ['top', 'bottom'],
			},
        },

		edit: props => {
            let style = {};
            style['--cols'] = `${props.attributes.columns || attributes.columns.default}`;
			const layout = props.attributes.layout || attributes.layout.default;
			return el( 'div',
				{ className: `${props.className} ${prefix}main ${prefix}layout-${layout}`, style },
				el( wp.blockEditor.InnerBlocks, {
                    allowedBlocks: [
                        'fc-gutenberg-blocks/lanuwa-vertical-videos'
                    ],
                    template: [
                        [ 'fc-gutenberg-blocks/lanuwa-vertical-videos' ],
						[ 'fc-gutenberg-blocks/lanuwa-vertical-videos' ],
                    ],
                    templateLock: false,
                }),
				
				el( wp.element.Fragment, // sidebar
					{},
					el( wp.blockEditor.InspectorControls, {},
						el( wp.components.PanelBody, { className: `${prefix}main` },
							el( wp.components.RangeControl, {
								label: 'Columns',
								value: props.attributes.columns || attributes.columns.default,
								onChange: value => {
									props.setAttributes( { columns: value } );
								},
								min: 1,
								max: 4
							}),
							el(wp.components.SelectControl, {
								label: 'Layout',
								value: layout,
								options: [
									{ value: 'horisontal', label: 'Horisontal' },
									{ value: 'vertical', label: 'Vertical' },
								],
								onChange: value => {
									props.setAttributes({ layout: value });
								},
							}),
						)
					),
				)
			);
		},
		save: props => {
			let style = {};
			style['--cols'] = `${props.attributes.columns || attributes.columns.default}`;
			const layout = props.attributes.layout || attributes.layout.default;
			return el( 'div',
				{ className: `${prefix}main ${prefix}layout-${layout}`, style },
                el( wp.blockEditor.InnerBlocks.Content ),
            );
		},
	} );

})();