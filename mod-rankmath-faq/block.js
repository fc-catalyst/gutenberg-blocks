(() => {

    const effected_blocks = ['rank-math/faq-block'];

    const addClass = (classNames, classNameToAdd) => {
        const classes = classNames?.split(' ') || [];
        if (!hasClass(classNameToAdd)) {
            classes.push(classNameToAdd);
        }
        return [...new Set(classes)].join(' ');
    };

    const removeClass = (classNames, classNameToRemove) => {
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

    wp.hooks.addFilter(
        'editor.BlockEdit',
        blockName + '-control',
        wp.compose.createHigherOrderComponent( BlockEdit => {
            return props => {
                return el(
                    wp.element.Fragment,
                    {},
                    el(BlockEdit, props),
                    toggle(props, 'brand-faq-container', 'Add Decoration'),
                );
            };
        })
    );

})();