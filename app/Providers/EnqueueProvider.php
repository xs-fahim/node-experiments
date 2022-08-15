<?php

namespace GenieAi\App\Providers;

use GenieAi\Bootstrap\System\Abstraction\ServiceProvider;

class EnqueueProvider implements ServiceProvider
{

    public function boot()
    {
        add_action('enqueue_block_editor_assets', [$this, 'addEnqueue']);
        add_action('admin_enqueue_scripts', [$this, 'addEnqueue']);
        
        add_action('admin_enqueue_scripts', [$this, 'globalScripts']);
    }


    public function addEnqueue()
    {
        $current_screen = get_current_screen();

        if($current_screen->base !== 'toplevel_page_getgenie' && $current_screen->base !== 'post'){
            return;
        }
        wp_enqueue_script( 'getgenie-admin-scripts', genie_app()->getBaseUrl('assets/dist/admin/js/admin.js'), ['wp-plugins','wp-edit-post', 'wp-i18n', 'wp-element', 'wp-dom', 'wp-data'], GETGENIE_VERSION, true );
        wp_enqueue_style( 'getgenie-admin-style', genie_app()->getBaseUrl('assets/dist/admin/css/admin.css'), [], GETGENIE_VERSION );
    }

    public function globalScripts()
    {
        wp_enqueue_script( 'getgenie-template-scripts', genie_app()->getBaseUrl('assets/dist/admin/js/template.js'), ['wp-plugins', 'wp-i18n', 'wp-element', 'wp-dom', 'wp-data'], GETGENIE_VERSION, true );
        // temporary css
        wp_enqueue_style( 'getgenie-admin-style', genie_app()->getBaseUrl('assets/dist/admin/css/admin.css'), [], GETGENIE_VERSION );
        wp_enqueue_style( 'getgenie-admin-global-style', genie_app()->getBaseUrl('assets/dist/admin/css/global.css'), [], GETGENIE_VERSION );
    }

}

