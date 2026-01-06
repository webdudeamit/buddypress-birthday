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
                    <PanelBody title={__('Birthday Settings', 'birthday-block-for-buddypress')}>
                        <PanelRow>
                            <p>
                                {__('Display upcoming birthdays of your members.', 'birthday-block-for-buddypress')}
                            </p>
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('Title', 'birthday-block-for-buddypress')}
                                value={attributes.title}
                                onChange={onChangeTitle}
                            />
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Show the age of the person', 'birthday-block-for-buddypress')}
                                checked={attributes.displayAge}
                                onChange={onCheckedAge}
                            >
                            </CheckboxControl>
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Enable option to send birthday wishes', 'birthday-block-for-buddypress')}
                                checked={attributes.sendMessage}
                                onChange={onCheckedWishes}
                            >
                            </CheckboxControl>
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Show birthday emoji', 'birthday-block-for-buddypress')}
                                checked={attributes.emoji}
                                onChange={(emoji) => setAttributes({ emoji })}
                            >
                            </CheckboxControl>
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('Date format', 'birthday-block-for-buddypress')}
                                value={attributes.dateFormat}
                                onChange={onChangeDateFormate}
                                help={__('PHP date format (e.g., F d for "January 15")', 'birthday-block-for-buddypress')}
                            />
                        </PanelRow>
                        <PanelRow>
                            <SelectControl
                                label={__('Birthday range limit', 'birthday-block-for-buddypress')}
                                value={attributes.rangeLimit}
                                onChange={onChangeRangeLimit}
                                options={[
                                    { value: 'upcoming', label: __('Upcoming (All Future)', 'birthday-block-for-buddypress') },
                                    { value: 'today', label: __('Today Only', 'birthday-block-for-buddypress') },
                                    { value: 'weekly', label: __('Next 7 Days', 'birthday-block-for-buddypress') },
                                    { value: 'monthly', label: __('This Month', 'birthday-block-for-buddypress') },
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <SelectControl
                                label={__('Show Birthdays of', 'birthday-block-for-buddypress')}
                                value={attributes.birthdaysOf}
                                onChange={onChangeBirthdaysOf}
                                options={[
                                    { value: 'all', label: __('All Members', 'birthday-block-for-buddypress') },
                                    { value: 'friends', label: __('Friends Only', 'birthday-block-for-buddypress') },
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <SelectControl
                                label={__('Display Name Type', 'birthday-block-for-buddypress')}
                                value={attributes.nameType}
                                onChange={onChangeNameTypet}
                                options={[
                                    { value: 'display_name', label: __('Display Name', 'birthday-block-for-buddypress') },
                                    { value: 'username', label: __('Username', 'birthday-block-for-buddypress') },
                                    { value: 'full_name', label: __('Full Name (from xProfile)', 'birthday-block-for-buddypress') },
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <NumberControl
                                label={__('Number of birthdays to show', 'birthday-block-for-buddypress')}
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
