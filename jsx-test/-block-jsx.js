const { registerBlockType } = wp.blocks;
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

    edit: ({ attributes, setAttributes }) => {
        const { showBorder } = attributes;

        return (
            <div>
                <InspectorControls>
                    <PanelBody title="Block Settings" initialOpen={true}>
                        <ToggleControl
                            label="Show Border"
                            checked={showBorder}
                            onChange={() => setAttributes({ showBorder: !showBorder })}
                        />
                    </PanelBody>
                </InspectorControls>
                <div className={showBorder ? 'block-with-border' : 'block-without-border'}>
                    <InnerBlocks template={[['core/heading'], ['core/paragraph']]} />
                </div>
            </div>
        );
    },

    save: ({ attributes }) => {
        const { showBorder } = attributes;

        return (
            <div className={showBorder ? 'block-with-border' : 'block-without-border'}>
                <InnerBlocks.Content />
            </div>
        );
    },
});
