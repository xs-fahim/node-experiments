<?php

/**
 * Plugin Name: GetGenie AI
 * Description:  Genie AI is the most intuitive A.I Content Wordpress Plugin that can help you save time and write smarter.
 * Plugin URI: https://getgenie.ai/
 * Author: getgenieai
 * Version: 1.0.6-test
 * Author URI: https://getgenie.ai/
 *
 * Text Domain: getgenie
 *
 * @package Genie AI
 * @category Pro
 *
 * License: GPLv3 or later
 */

defined('ABSPATH') || exit;

define('GETGENIE_VERSION', '1.0.6'.time());
define('GETGENIE_URL', trailingslashit(plugin_dir_url(__FILE__)));
define('GETGENIE_DIR', trailingslashit(plugin_dir_path( __FILE__ )));

define('GETGENIE_NLP_REMOTE_ADDR', 'https://nlp.getgenie.ai/');
define('GETGENIE_ACCOUNT_REMOTE_ADDR', 'https://app.getgenie.ai/');

define('GETGENIE_BLOGWIZARD_PREFIX', 'getgenie_blogwizard_');
define('GETGENIE_HISTORY_PREFIX', 'getgenie_history_');


add_action('admin_bar_menu', 'add_toolbar_items', 100);
function add_toolbar_items($admin_bar){
    $admin_bar->add_menu( array(
        'id'    => 'getgenie-template-list',
        'title' => 'Write Template',
        'meta'  => array(   
            'title' => __('Write Template'),            
        ),
    ));
    // $admin_bar->add_menu( array(
    //     'id'    => 'my-sub-item',
    //     'parent' => 'my-item',
    //     'title' => 'My Sub Menu Item',
    //     'href'  => '#',
    //     'meta'  => array(
    //         'title' => __('My Sub Menu Item'),
    //         'target' => '_blank',
    //         'class' => 'my_menu_item_class'
    //     ),
    // ));
    // $admin_bar->add_menu( array(
    //     'id'    => 'my-second-sub-item',
    //     'parent' => 'my-item',
    //     'title' => 'My Second Sub Menu Item',
    //     'href'  => '#',
    //     'meta'  => array(
    //         'title' => __('My Second Sub Menu Item'),
    //         'target' => '_blank',
    //         'class' => 'my_menu_item_class'
    //     ),
    // ));
}

function getgenie_blogwizard_store_objects()
{
    return [
        'keyword',
        'seoEnabled',
        'selectedCountry',
        'titleCreativityLevel',

        'introCreativityLevel',

        'outlineCreativityLevel',

        'generatedTitles',
        'generatedIntros',
        'generatedOutlines',

        'selectedTitle',
        'selectedIntro',
        'selectedOutlines',

        'serpData',
        'keywordData'
    ];
}

function getgenie_templates()
{
    $data = null;
    $cache_key = 'getgenie_writing_templates';
    $cached = get_option($cache_key, ['time' => 0]);
    if (!empty($cached['data']) && !empty($cached['time']) && $cached['time'] + (1 * 60 * 60) >= time()) {
        return $cached['data'];
    }
    
    $remote_url = GETGENIE_NLP_REMOTE_ADDR . 'writer-default/get-templates';
    $response = wp_remote_request($remote_url, array(
        'method'      => 'POST',
        'timeout'     => 30,
        'redirection' => 3,
        'httpversion' => '1.0',
        'sslverify' => false,
        'blocking'    => true,
        'headers' => array(
            'Content-Type' => 'application/json',
        ),
    ));

    if (200 === wp_remote_retrieve_response_code($response)) {
        $response_body = wp_remote_retrieve_body($response);
        $response_body_decoded = json_decode($response_body);

        if((is_array($response_body_decoded) || is_object($response_body_decoded)) && !empty($response_body_decoded)) {
            $data = $response_body;
        }
        unset($response_body_decoded);
        unset($response_body);
    }

    if($data === null) {
        if(!empty($cached['data'])) {
            $cached_data_decoded = json_decode($cached['data']);
        }
        
        if((is_array($cached_data_decoded) || is_object($cached_data_decoded)) && !empty($cached_data_decoded)) {
            $data = $cached['data'];
            unset($cached_data_decoded);
        }else{
            $data = file_get_contents(GETGENIE_DIR . 'config/templates.json');
        }
        
    }
    
    update_option($cache_key, [
        'data' => $data,
        'time' => time()
    ]);

    return $data;
}

function getgenie_admin_notice() {

    echo "<div class='notice notice-warning is-dismissible getgenie-notice-wrapper'>
            <div class='getgenie-notice'>
                <p class='notice-message'>
                    <img src='".GETGENIE_URL."/assets/dist/admin/images/genie-head.svg"."' class='notice-icon' />
                     I've noticed that you haven't activated the Pro/Free license yet. Click the button below to unleash my magic. Sincerely — GetGenie AI
                </p>
                <div class='notice-link'>
                    <a href='https://app.getgenie.ai/license/?product=free-trial' target='_blank'>Claim your license</a>
                    <a href='".admin_url('admin.php?page=' .  genie_app()->getTextDomain())."#license'>Finish setup with your license.</a>
                </div>
            </div>
          </div>"; 
    }

if(empty(get_option('getgenie_site_token', ''))){
    add_action( 'admin_notices', 'getgenie_admin_notice' );
}

add_action('admin_head', function(){

    $blog_wizard_data = [
        'post_id' => get_the_ID(),
    ];

    $blogwizard_objects = getgenie_blogwizard_store_objects();
    foreach ($blogwizard_objects as $object) {
        $blog_wizard_data[$object] = json_decode(get_post_meta(get_the_ID(), GETGENIE_BLOGWIZARD_PREFIX . $object, true));
    }

    $token = new \GenieAi\App\Auth\TokenManager();
    $_nonce = wp_create_nonce( 'wp_rest' );

    $config = [
        'version' => GETGENIE_VERSION,
        'restNonce' => $_nonce,
        'siteUrl' => get_site_url(),
        'assetsUrl' => GETGENIE_URL . 'assets/',
        'baseApi' => get_rest_url(null, 'getgenie/v1/'),
        'parserApi' => GETGENIE_NLP_REMOTE_ADDR,
        'parserApiWp' => get_rest_url(null, 'getgenie/v1/parser/'),
        'usageLimitStatsApi' => get_rest_url(null, 'getgenie/v1/limit_usage_stats/'),
        'storeApi' => get_rest_url(null, 'getgenie/v1/store/'),
        'licenseApi' => get_rest_url(null, 'getgenie/v1/license/'),
        'feedbackApi' => get_rest_url(null, 'getgenie/v1/feedback/'),
        'historyApi' => get_rest_url(null, 'getgenie/v1/history/'),
        'templateList' => json_decode(getgenie_templates()),
        'licenseKeyLength' => 46,
        'siteToken' => get_option('getgenie_site_token', ''),
        'authToken' => $token->generate(), // access_denied or 4gb3rv3dyvy3h59gvwscdt3rerf23
        'authTokenLeaserApi' => admin_url('admin-ajax.php?action=lease_auth_token'), // wp-ajax 
    ];

    ?>
    <script>
        window.getGenie = window.getGenie || {};
        window.getGenie.config = <?php echo json_encode($config); ?>;
        window.getGenie.blogWizardData = <?php echo json_encode($blog_wizard_data); ?>;
    </script>
<?php
});


include 'vendor/autoload.php';

GenieAi\Bootstrap\Bootstrap::init(__FILE__);

new \GenieAi\App\Api\Feedback();
new \GenieAi\App\Api\Parser();

new \GenieAi\App\Api\License();
new \GenieAi\App\Api\UsageLimitStats();
new \GenieAi\App\Api\LeaseToken();

new \GenieAi\App\Services\History\Cpt();
new \GenieAi\App\Api\Store();
new \GenieAi\App\Api\History();