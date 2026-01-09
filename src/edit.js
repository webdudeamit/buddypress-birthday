/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl, Panel, PanelBody, PanelRow, CheckboxControl, SelectControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import Members from './data/members';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
function Edit({ attributes, setAttributes }) {
    const onChangeTitle = (title) => {
        setAttributes({ title: title });
    };

    const onCheckedAge = (displayAge) => {
        setAttributes({ displayAge: displayAge });
    }

    const onCheckedWishes = (sendMessage) => {
        setAttributes({ sendMessage: sendMessage });
    }

    const onChangeDateFormate = (dateFormat) => {
        setAttributes({ dateFormat: dateFormat });
    }

    const onChangeRangeLimit = (rangeLimit) => {
        setAttributes({ rangeLimit: rangeLimit });
    }
    const onChangeBirthdaysOf = (birthdaysOf) => {
        setAttributes({ birthdaysOf: birthdaysOf });
    }
    const onChangeNameTypet = (nameType) => {
        setAttributes({ nameType: nameType });
    }
    const onChangelimit = (limit) => {
        setAttributes({ limit: limit });
    }

    return (
        <div {...useBlockProps()}>
            <InspectorControls key="setting">
                <Panel>
                    <PanelBody title={__('Birthday Settings', 'buddypress-birthdays')}>
                        <PanelRow>
                            <p>
                                {__('Display upcoming birthdays of your members.', 'buddypress-birthdays')}
                            </p>
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('Title', 'buddypress-birthdays')}
                                value={attributes.title}
                                onChange={onChangeTitle}
                            />
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Show the age of the person', 'buddypress-birthdays')}
                                checked={attributes.displayAge}
                                onChange={onCheckedAge}
                            >
                            </CheckboxControl>
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Enable option to send birthday wishes', 'buddypress-birthdays')}
                                checked={attributes.sendMessage}
                                onChange={onCheckedWishes}
                            >
                            </CheckboxControl>
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Show birthday emoji', 'buddypress-birthdays')}
                                checked={attributes.emoji}
                                onChange={(emoji) => setAttributes({ emoji })}
                            >
                            </CheckboxControl>
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('Date format', 'buddypress-birthdays')}
                                value={attributes.dateFormat}
                                onChange={onChangeDateFormate}
                                help={__('PHP date format (e.g., F d for "January 15")', 'buddypress-birthdays')}
                            />
                        </PanelRow>
                        <PanelRow>
                            <SelectControl
                                label={__('Birthday range limit', 'buddypress-birthdays')}
                                value={attributes.rangeLimit}
                                onChange={onChangeRangeLimit}
                                options={[
                                    { value: 'upcoming', label: __('Upcoming (All Future)', 'buddypress-birthdays') },
                                    { value: 'today', label: __('Today Only', 'buddypress-birthdays') },
                                    { value: 'weekly', label: __('Next 7 Days', 'buddypress-birthdays') },
                                    { value: 'monthly', label: __('This Month', 'buddypress-birthdays') },
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <SelectControl
                                label={__('Show Birthdays of', 'buddypress-birthdays')}
                                value={attributes.birthdaysOf}
                                onChange={onChangeBirthdaysOf}
                                options={[
                                    { value: 'all', label: __('All Members', 'buddypress-birthdays') },
                                    { value: 'friends', label: __('Friends Only', 'buddypress-birthdays') },
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <SelectControl
                                label={__('Display Name Type', 'buddypress-birthdays')}
                                value={attributes.nameType}
                                onChange={onChangeNameTypet}
                                options={[
                                    { value: 'display_name', label: __('Display Name', 'buddypress-birthdays') },
                                    { value: 'username', label: __('Username', 'buddypress-birthdays') },
                                    { value: 'full_name', label: __('Full Name (from xProfile)', 'buddypress-birthdays') },
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <NumberControl
                                label={__('Number of birthdays to show', 'buddypress-birthdays')}
                                value={attributes.limit}
                                onChange={onChangelimit}
                                min={1}
                                max={50}
                            />
                        </PanelRow>
                    </PanelBody>
                </Panel>
            </InspectorControls>
            <Members {...attributes}></Members>
        </div>
    );
}

export default Edit;
