<?php
/**
 * Populate Dummy Birthday Data
 *
 * This script adds random birthday dates to all BuddyPress members
 * Run this once to populate test data
 *
 * @package buddypress-birthday
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Populate dummy birthdays for all members
 *
 * @return array Results of the operation
 */
function bp_birthday_populate_dummy_data() {
	// Check if BuddyPress is active
	if ( ! function_exists( 'buddypress' ) ) {
		return array(
			'success' => false,
			'message' => 'BuddyPress is not active.',
		);
	}

	// Get the birthday field ID from settings
	$field_id = get_option( 'bp_birthday_field_id', 0 );

	if ( ! $field_id ) {
		return array(
			'success' => false,
			'message' => 'No birthday field configured. Please configure it in Settings > BP Birthday first.',
		);
	}

	global $wpdb;
	$bp_prefix = bp_core_get_table_prefix();

	// Get all users
	$users = $wpdb->get_results( "SELECT ID FROM {$wpdb->users} ORDER BY ID ASC" );

	if ( empty( $users ) ) {
		return array(
			'success' => false,
			'message' => 'No users found.',
		);
	}

	$updated   = 0;
	$skipped   = 0;
	$errors    = 0;
	$birthdays = array();

	foreach ( $users as $user ) {
		$user_id = $user->ID;

		// Check if user already has a birthday
		$existing = xprofile_get_field_data( $field_id, $user_id );

		if ( ! empty( $existing ) && $existing !== '0000-00-00' ) {
			$skipped++;
			continue;
		}

		// Generate a random birthday (age between 18 and 65)
		$min_age = 18;
		$max_age = 65;
		$age     = rand( $min_age, $max_age );

		// Calculate birth year
		$birth_year = date( 'Y' ) - $age;

		// Random month and day
		$birth_month = str_pad( rand( 1, 12 ), 2, '0', STR_PAD_LEFT );
		$birth_day   = str_pad( rand( 1, 28 ), 2, '0', STR_PAD_LEFT ); // Using 28 to avoid invalid dates

		$birthday = $birth_year . '-' . $birth_month . '-' . $birth_day . ' 00:00:00';

		// Update the xProfile field
		$updated_field = xprofile_set_field_data( $field_id, $user_id, $birthday );

		if ( $updated_field ) {
			$updated++;
			$birthdays[] = array(
				'user_id'  => $user_id,
				'birthday' => $birthday,
				'age'      => $age,
			);
		} else {
			$errors++;
		}
	}

	return array(
		'success'   => true,
		'message'   => sprintf(
			'Birthday data populated successfully. Updated: %d, Skipped: %d, Errors: %d',
			$updated,
			$skipped,
			$errors
		),
		'updated'   => $updated,
		'skipped'   => $skipped,
		'errors'    => $errors,
		'birthdays' => $birthdays,
	);
}

/**
 * Clear all birthday data (for testing)
 *
 * @return array Results of the operation
 */
function bp_birthday_clear_dummy_data() {
	// Check if BuddyPress is active
	if ( ! function_exists( 'buddypress' ) ) {
		return array(
			'success' => false,
			'message' => 'BuddyPress is not active.',
		);
	}

	// Get the birthday field ID from settings
	$field_id = get_option( 'bp_birthday_field_id', 0 );

	if ( ! $field_id ) {
		return array(
			'success' => false,
			'message' => 'No birthday field configured.',
		);
	}

	global $wpdb;
	$bp_prefix = bp_core_get_table_prefix();

	// Delete all data for this field
	$deleted = $wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$bp_prefix}bp_xprofile_data WHERE field_id = %d",
			$field_id
		)
	);

	return array(
		'success' => true,
		'message' => sprintf( 'Cleared %d birthday records.', $deleted ),
		'deleted' => $deleted,
	);
}

/**
 * Admin page for populating dummy data
 */
function bp_birthday_dummy_data_admin_page() {
	// Check user capabilities
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// Handle form submissions
	$result = null;
	if ( isset( $_POST['bp_birthday_populate'] ) && check_admin_referer( 'bp_birthday_dummy_data' ) ) {
		$result = bp_birthday_populate_dummy_data();
	} elseif ( isset( $_POST['bp_birthday_clear'] ) && check_admin_referer( 'bp_birthday_dummy_data' ) ) {
		$result = bp_birthday_clear_dummy_data();
	}

	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'BuddyPress Birthday - Dummy Data', 'buddypress-birthday-block' ); ?></h1>

		<?php if ( $result ) : ?>
			<div class="notice notice-<?php echo $result['success'] ? 'success' : 'error'; ?> is-dismissible">
				<p><?php echo esc_html( $result['message'] ); ?></p>
				<?php if ( ! empty( $result['birthdays'] ) && count( $result['birthdays'] ) <= 10 ) : ?>
					<details>
						<summary><?php esc_html_e( 'View sample data', 'buddypress-birthday-block' ); ?></summary>
						<ul>
							<?php foreach ( array_slice( $result['birthdays'], 0, 10 ) as $birthday ) : ?>
								<li>
									User ID: <?php echo esc_html( $birthday['user_id'] ); ?> -
									Birthday: <?php echo esc_html( $birthday['birthday'] ); ?> -
									Age: <?php echo esc_html( $birthday['age'] ); ?>
								</li>
							<?php endforeach; ?>
						</ul>
					</details>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<div class="card">
			<h2><?php esc_html_e( 'Populate Dummy Birthday Data', 'buddypress-birthday-block' ); ?></h2>
			<p>
				<?php esc_html_e( 'This will add random birthday dates (ages 18-65) to all BuddyPress members who don\'t have a birthday set.', 'buddypress-birthday-block' ); ?>
			</p>
			<p>
				<strong><?php esc_html_e( 'Note:', 'buddypress-birthday-block' ); ?></strong>
				<?php esc_html_e( 'Make sure you have configured the birthday field in Settings > BP Birthday before running this.', 'buddypress-birthday-block' ); ?>
			</p>

			<form method="post" style="margin-top: 20px;">
				<?php wp_nonce_field( 'bp_birthday_dummy_data' ); ?>
				<button type="submit" name="bp_birthday_populate" class="button button-primary">
					<?php esc_html_e( 'Populate Dummy Birthdays', 'buddypress-birthday-block' ); ?>
				</button>
				<button type="submit" name="bp_birthday_clear" class="button button-secondary"
						onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to clear all birthday data? This cannot be undone.', 'buddypress-birthday-block' ); ?>');">
					<?php esc_html_e( 'Clear All Birthday Data', 'buddypress-birthday-block' ); ?>
				</button>
			</form>
		</div>

		<div class="card" style="margin-top: 20px;">
			<h3><?php esc_html_e( 'Alternative: WP-CLI Command', 'buddypress-birthday-block' ); ?></h3>
			<p><?php esc_html_e( 'You can also populate data using WP-CLI:', 'buddypress-birthday-block' ); ?></p>
			<pre style="background: #f5f5f5; padding: 10px; border-radius: 3px;">wp eval "include 'wp-content/plugins/buddypress-birthdays/includes/populate-dummy-birthdays.php'; print_r(bp_birthday_populate_dummy_data());"</pre>
		</div>
	</div>
	<?php
}

/**
 * Add admin menu item
 */
function bp_birthday_dummy_data_menu() {
	add_submenu_page(
		'options-general.php',
		__( 'BP Birthday - Dummy Data', 'buddypress-birthday-block' ),
		__( 'BP Birthday Data', 'buddypress-birthday-block' ),
		'manage_options',
		'bp-birthday-dummy-data',
		'bp_birthday_dummy_data_admin_page'
	);
}
add_action( 'admin_menu', 'bp_birthday_dummy_data_menu' );
