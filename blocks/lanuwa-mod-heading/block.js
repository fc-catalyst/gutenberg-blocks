(() => {

    const effected_blocks = ['core/heading'];

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
                    toggle(props, 'heading-decorated', 'Add Decoration'),
                    toggle(props, 'toc-ignore', 'Ignore the Table of Content'),
                );
            };
        })
    );

})();

(() => {

    const effected_blocks = ['core/heading'];

    const newVar = {
        name: 'title',
        type: 'string',
        default: '',
    };
    const el = wp.element.createElement;
    const input = (props, name, label) => {
        return (~effected_blocks.indexOf(props.name)) ? (
            el(wp.blockEditor.InspectorControls, {},
                el(wp.components.PanelBody, {},
                    el(wp.components.TextControl, {
                        label: label,
                        value: props.attributes[name],
                        onChange: value => {
                            props.setAttributes({ [name]: value });
                        },
                    })
                )
            )
        ) : null
    };

    wp.hooks.addFilter(
        'blocks.registerBlockType',
        blockName + '-toc-title-attribute',
        (settings, name) => {
            if ( !~effected_blocks.indexOf(name) ) { return settings }
            settings.attributes[newVar.name] = newVar;
            return settings;
        }
    );

    wp.hooks.addFilter(
        'editor.BlockEdit',
        blockName + '-toc-title-control',
        wp.compose.createHigherOrderComponent( BlockEdit => {
            return props => {
                return el(
                    wp.element.Fragment,
                    {},
                    el(BlockEdit, props),
                    input(props, newVar.name, 'TOC Alternative Title'),
                );
            };
        })
    );

    wp.hooks.addFilter(
        'blocks.getSaveContent.extraProps',
        blockName + '-toc-title-save',
        (saveElementProps, blockType, attributes) => {
            if ( !~effected_blocks.indexOf(blockType.name) ) { return saveElementProps }
            saveElementProps[newVar.name] = attributes[newVar.name];
            return saveElementProps;
        }
    );
/*
    wp.hooks.addFilter(
        'blocks.getBlockAttributes',
        blockName + '-toc-title-avoid',
        (attributes, blockType) => {
            if ( !~effected_blocks.indexOf(blockType.name) ) { return attributes }
            console.log(attributes);
            delete attributes[newVar.name];
            return attributes;
        }
    );
//*/

})();