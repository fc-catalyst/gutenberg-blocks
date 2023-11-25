const registerBlockType = wp.blocks.registerBlockType;
const { InspectorControls, InnerBlocks } = wp.blockEditor;
const { PanelBody, ToggleControl } = wp.components;

registerBlockType('your-namespace/your-block', {
    title: 'Your Block',
    icon: 'shield', // Change the icon as needed
    category: 'common',
    attributes: {
        showBorder: {
            type: 'boolean',
            default: true,
        },
    },

    edit: function(props) {
        const { attributes, setAttributes } = props;
        const { showBorder } = attributes;

        function toggleBorder() {
            setAttributes({ showBorder: !showBorder });
        }

        return [
            wp.element.createElement(
                InspectorControls,
                null,
                wp.element.createElement(
                    PanelBody,
                    { title: 'Block Settings', initialOpen: true },
                    wp.element.createElement(ToggleControl, {
                        label: 'Show Border',
                        checked: showBorder,
                        onChange: toggleBorder,
                    })
                )
            ),
            wp.element.createElement(
                'div',
                { className: showBorder ? 'block-with-border' : 'block-without-border' },
                wp.element.createElement(InnerBlocks, null)
            ),
        ];
    },

    save: function(props) {
        const { attributes } = props;
        const { showBorder } = attributes;

        return wp.element.createElement(
            'div',
            { className: showBorder ? 'block-with-border' : 'block-without-border' },
            wp.element.createElement(InnerBlocks.Content, null)
        );
    },
});