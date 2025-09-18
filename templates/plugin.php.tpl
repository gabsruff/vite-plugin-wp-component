<?php
/**
 * Plugin Name: <%= componentName %> - Custom Component
 * Description: <%= componentDescription %> | Insert the component using the shortcode: [<%= slug %>].
 * Version: 1.0.0
 * Author: <%= author %>
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function <%= _slug %>_enqueue_assets() {
    $plugin_url = plugin_dir_url( __FILE__ );
    wp_enqueue_style(
        '<%= slug %>-style',
        $plugin_url . 'assets/style.css',
        array(),
        filemtime( plugin_dir_path( __FILE__ ) . 'assets/style.css' )
    );
    wp_enqueue_script(
        '<%= slug %>-script',
        $plugin_url . 'assets/index.js',
        array(),
        filemtime( plugin_dir_path( __FILE__ ) . 'assets/index.js' ),
        true
    );
}
add_action( 'wp_enqueue_scripts', '<%= _slug %>_enqueue_assets' );

// Shortcode para renderizar el componente
function <%= _slug %>_shortcode() {
    return '<div id="<%= rootID %>"></div>';
}
add_shortcode( '<%= slug %>', '<%= _slug %>_shortcode' );
