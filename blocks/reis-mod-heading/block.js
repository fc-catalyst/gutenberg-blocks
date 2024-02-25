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