# Gutenberg Blocks

* dividied by branches
* core branch is the main one; changes in core branch must be merged to every other branch
* other branches are divided by clients; they contain the core and custom blocks
* blocks are stored in ../blocks

## possible content for blocks' dirs

### block dir name:
* any   - dir name equals block name
* -*    - dir to be ignored
* .*    - dir to be ignored
* mod-* - dir for modifications to load files without the block presence check

### a block dir can contain:
* block.js
* editor.css

* style.css
* style-inline.css - adds the content inline, automatically minified
* script.js
* script-inline.js - adds the content inline
* script-defer.js - defers the script loading