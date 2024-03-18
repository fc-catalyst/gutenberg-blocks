(() => {

	const el = wp.element.createElement;
	const attributes = { // to have the access to the default values
		url: {
			type: 'string',
			default: '',
		},
		timemarks: {
			type: 'array',
			default: [['','']],
		},
	};

	const getVideoId = url => {
		return ( url.match(/^https?\:\/\/(?:www\.)?youtu(?:.)+[=\/]{1}([\w_\-]{11})(?:[^\w_\-].+)*$/i) || ['',''] )[1];
	};

	const iframe = url => {
		const id = getVideoId(url);
		if ( id === '' ) { return null }

		return el( 'iframe', {
			'width': '560',
			'height': '315',
			'src': `https://www.youtube.com/embed/${id}`,
			'title': 'YouTube video player',
			'frameborder': 0,
			'allow': 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
			'allowfullscreen': true,
		});
	};

	const lis = lis => {
		return lis.map(li => {
			if ( li[0].trim() === '' || !/^\d{1,2}:\d{2}$/.test(li[1]) ) { return null }
			return el( 'li', {}, 
				el( 'span', {}, li[1] ),
				li[0]
			);
		});
	};

	const blis = lis => {
		return lis.map(li => {
			if ( li[0].trim() === '' || !/^\d{1,2}:\d{2}$/.test(li[1]) ) { return null }
			return el( 'li', {}, 
				el( 'button', { title: `Scroll video to ${li[1]}` }, 
					el( 'span', {}, li[1] ),
					li[0]
				),
			);
		});
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
			spacing: {
				margin: ['top', 'bottom'],
			},
        },

		edit: props => {
			const timemarkField = ind => {
				const timemarks = [...props.attributes.timemarks];
				return [
					el( 'div', { className: `${prefix}mark` }, 
						el(wp.components.TextControl, {
							className: `${prefix}title`,
							label: 'Title',
							value: timemarks[ind][0],
							placeholder: '',
							onChange: value => {
								timemarks[ind][0] = value;
								props.setAttributes({ timemarks });
							},
						}),
						el(wp.components.TextControl, {
							className: `${prefix}time`,
							label: 'Time',
							value: timemarks[ind][1],
							placeholder: '00:00',
							pattern: '\d{1,2}:\d{2}',
							size: 5,
							onChange: value => {
								timemarks[ind][1] = value;
								props.setAttributes({ timemarks });
							},
						}),
						el( 'button', { className: `${prefix}delete`,
							onClick: () => {
								const new_timemarks = timemarks.filter((a,i) => i !== ind);
								props.setAttributes({ timemarks: new_timemarks });
							},
						}, '+' ),
					)
				];
			};

			const timemarkFields = () => {
				return props.attributes.timemarks.map((v,i) => {
					return timemarkField(i);
				});
			};

			return el( 'div', { className: `${props.className} ${prefix}main` },
				el( 'div', { className: `${prefix}video` },
					props.attributes.url && iframe(props.attributes.url) || 'Youtube Video'
				),
				el( 'ul', { className: `${prefix}timemarks` },
					lis(props.attributes.timemarks)
				),
				el( wp.element.Fragment, {}, // sidebar
					el( wp.blockEditor.InspectorControls, {},
						el( wp.components.PanelBody, { className: `${prefix}main`, title: 'Timemarks' },
							el(wp.components.TextControl, {
								label: 'Youtube video URL',
								value: props.attributes.url,
								placeholder: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
								onChange: value => {
									props.setAttributes({ url: value });
								},
							}),
						),
						el( wp.components.PanelBody, { className: `${prefix}main`, title: 'Timemarks' },
							el( 'div', { className: `${prefix}marks` }, 
								timemarkFields(),
							),
							el( 'button', { className: `${prefix}add button` ,
								onClick: () => {
									const timemarks = [...props.attributes.timemarks, ['','']];
									props.setAttributes({ timemarks });
								}
							}, '+' ),
						),
					),
				),
			);
		},
		save: props => {
			if ( !props.attributes.url || !getVideoId(props.attributes.url) ) { return null }
			return el( 'div', { className: `${props.className} ${prefix}main` },
				el( 'div', { className: `${prefix}video`, 'data-id': getVideoId(props.attributes.url) },
					props.attributes.url && iframe(props.attributes.url)
				),
				el( 'ul', { className: `${prefix}timemarks` },
					blis(props.attributes.timemarks),
				),
			);
		},
	} );
})();