/**
 * Save function for dynamic block
 *
 * This is a dynamic block that renders on the server side using render.php,
 * so we return null here.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {null} Null since this is a dynamic block.
 */
function save() {
    // This is a dynamic block rendered on the server via render.php
    return null;
}

export default save;
