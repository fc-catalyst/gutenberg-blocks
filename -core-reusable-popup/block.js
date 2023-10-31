(() => {

    const effected_blocks = ['core/button', 'fct/cropped-height'];

    const addClass = (classNames, classNameToAdd) => {
        const classes = classNames?.split(' ') || [];
        if (!hasClass(classNameToAdd)) {
            classes.push(classNameToAdd);
        }
        return [...new Set(classes)].join(' ');
    };

    const removeClass = (classNames, classNameToRemove) => { // ++do it by pattern!!!
        const classes = classNames?.split(' ') || [];
        const index = classes.indexOf(classNameToRemove);
        if (~index) {
            classes.splice(index, 1);
        }
        return classes.join(' ');
    };

    const hasClass = (classNames, classNameToCheck) => {
        const classes = classNames?.split(' ') || [];
        if (classes.includes(classNameToCheck)) { return true }
        return false;
    };

    // add the control / input
    const el = wp.element.createElement;
    const toggle = (props, name, label) => {
        return (props.isSelected && ~effected_blocks.indexOf(props.name)) ? (
            el(wp.blockEditor.InspectorControls, {},
                el(wp.components.PanelBody, {},
                    el(wp.components.ToggleControl, {
                        label: label,
                        checked: hasClass(props.attributes.className, name),
                        onChange: () => {
                            const addRemoveClass = hasClass(props.attributes.className, name) ? removeClass : addClass;
                            const newClassName = addRemoveClass(props.attributes.className, name);
                            props.setAttributes({ className: newClassName });
                        }
                    })
                )
            )
        ) : null
    };
    const select = (props, label, options, comment) => {
        const getClassName = () => {
            const classes = (props.attributes.className?.split(' ') || []).filter(Boolean);
            for (const className of classes) {
                const matchedOption = options.find(option => option.value === className);
                if (matchedOption) {
                    return matchedOption.value;
                }
            }
            return '';
        };

        return (
            props.isSelected && ~effected_blocks.indexOf(props.name) ? (
                el(
                    wp.blockEditor.InspectorControls,
                    {},
                    el(
                        wp.components.PanelBody,
                        {},
                        el(wp.components.SelectControl, {
                            label: label,
                            value: getClassName(),
                            options: options,
                            onChange: newValue => {
                                let clearedClassName = props.attributes.className;
                                options.forEach(option => {
                                    clearedClassName = removeClass(clearedClassName, option.value);
                                });
                                const newClassName = addClass(clearedClassName, newValue && newValue || '');
                                props.setAttributes({ className: newClassName });
                            },
                        }),
                        comment ? (
                            el('div', {},
                            comment
                        )
                        ) : null
                    )
                )
            ) : null
        );
    };


    wp.hooks.addFilter(
        'editor.BlockEdit',
        blockModName + '-control',
        wp.compose.createHigherOrderComponent( BlockEdit => {
            return props => {
                return el(
                    wp.element.Fragment,
                    {},
                    el(BlockEdit, props),
                    select(props, 'Reusable Block Popup',
                        [
                            { value: '', label: 'No Popup' },
                            ...blockArray
                        ],
                       el('a',
                            { href: '/wp-admin/edit.php?post_type=wp_block' },
                            'Manage Reusable blocks'
                        )
                    ),
                    toggle(props, 'popup-preload', 'Preload the content'), // ++can show if a block is selected
                );
            };
        })
    );

})();