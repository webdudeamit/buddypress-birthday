/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import '../editor.scss';

/**
 * The Members component displays birthday preview in the editor
 *
 * @param {Object} props Component properties
 * @return {WPElement} Element to render.
 */
function Members({ title, displayAge, sendMessage, dateFormat, rangeLimit, birthdaysOf, nameType, limit, emoji }) {
    const [birthdays, setBirthdays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Call useBlockProps only once at the top
    const blockProps = useBlockProps();

    useEffect(() => {
        setLoading(true);
        setError(null);

        const path = addQueryArgs('/buddypress-birthday/v1/birthdays', {
            range: rangeLimit || 'upcoming',
            limit: limit || 5,
            scope: birthdaysOf || 'all'
        });

        apiFetch({ path })
            .then((items) => {
                setBirthdays(items || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching birthdays:', error);
                setError(error.message || __('Error loading birthdays', 'buddypress-birthdays'));
                setLoading(false);
            });
    }, [rangeLimit, limit, birthdaysOf]);

    if (loading) {
        return (
            <div {...blockProps} className="bp-birthday-loading">
                {__('Loading birthdays...', 'buddypress-birthdays')}
            </div>
        );
    }

    if (error) {
        return (
            <div {...blockProps} className="bp-birthday-error">
                {error}
            </div>
        );
    }

    return (
        <div {...blockProps} className="bp-birthday-block">
            {title && (
                <h2 className="bp-birthday-title">{title}</h2>
            )}

            {birthdays.length > 0 ? (
                <ul className="bp-birthday-list item-list">
                    {birthdays.map((birthday) => (
                        <li key={birthday.user_id} className="bp-birthday-item">
                            <div className="item-avatar">
                                <a href={birthday.profile_url}>
                                    <img
                                        src={birthday.avatar}
                                        alt={birthday.name}
                                        className="avatar"
                                    />
                                </a>
                            </div>
                            <div className="item">
                                <div className="item-title">
                                    <a href={birthday.profile_url}>
                                        {birthday.name}
                                        {emoji && ' 🎂'}
                                    </a>
                                </div>
                                <div className="item-meta">
                                    <span className="bp-birthday-date">
                                        {birthday.formatted_date || birthday.next_birthday}
                                    </span>

                                    {birthday.days_until === 0 && (
                                        <span className="bp-birthday-today">
                                            {__('Today!', 'buddypress-birthdays')}
                                        </span>
                                    )}
                                    {birthday.days_until === 1 && (
                                        <span className="bp-birthday-soon">
                                            {__('Tomorrow', 'buddypress-birthdays')}
                                        </span>
                                    )}
                                    {birthday.days_until > 1 && (
                                        <span className="bp-birthday-days">
                                            {sprintf(__('in %d days', 'buddypress-birthdays'), birthday.days_until)}
                                        </span>
                                    )}

                                    {displayAge && birthday.age > 0 && (
                                        <span className="bp-birthday-age">
                                            {sprintf(__('Turning %d', 'buddypress-birthdays'), birthday.age + 1)}
                                        </span>
                                    )}
                                </div>
                                {sendMessage && birthday.message_url && (
                                    <div className="action">
                                        <a href={birthday.message_url} className="button bp-birthday-message">
                                            {__('Send Wishes', 'buddypress-birthdays')}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="bp-birthday-empty">
                    {rangeLimit === 'today' && __('No birthdays today', 'buddypress-birthdays')}
                    {rangeLimit === 'weekly' && __('No birthdays this week', 'buddypress-birthdays')}
                    {rangeLimit === 'monthly' && __('No birthdays this month', 'buddypress-birthdays')}
                    {(!rangeLimit || rangeLimit === 'upcoming') && __('No upcoming birthdays', 'buddypress-birthdays')}
                </p>
            )}
        </div>
    );
}

export default Members;
