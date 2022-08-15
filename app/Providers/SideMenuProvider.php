<?php

namespace GenieAi\App\Providers;

use GenieAi\Bootstrap\System\Abstraction\ServiceProvider;

class SideMenuProvider implements ServiceProvider
{

    public $menu_slug;

    public function __construct()
    {
        $this->menu_slug = admin_url('admin.php?page=' .  genie_app()->getTextDomain());
    }

    public function boot()
    {  
        add_action('admin_menu', function () {
            add_menu_page(
                esc_html__("Get Genie", 'getgenie'),
                esc_html__("Get Genie", 'getgenie'),
                'manage_options',
                genie_app()->getTextDomain(),
                [$this, 'writeForMePageData'],
                 GETGENIE_URL.'/assets/dist/admin/images/genie-head.svg',
                5
            );

            add_submenu_page(
                genie_app()->getTextDomain(),
                esc_html__("Get Genie | Write for me", 'getgenie'),
                esc_html__("Write for me", 'getgenie'),
                'manage_options',
                $this->menu_slug.'#write-for-me'
            );

            add_submenu_page(
                genie_app()->getTextDomain(),
                esc_html__("History | Get Genie", 'getgenie'),
                esc_html__("History", 'getgenie'),
                'manage_options',
                $this->menu_slug.'#history'
            );

            // add_submenu_page(
            //     genie_app()->getTextDomain(),
            //     esc_html__("Settings | Get Genie", 'getgenie'),
            //     esc_html__("Settings", 'getgenie'),
            //     'manage_options',
            //     $this->menu_slug.'#settings', 
            // );

            add_submenu_page(
                genie_app()->getTextDomain(),
                esc_html__("License | Get Genie", 'getgenie'),
                esc_html__("License", 'getgenie'),
                'manage_options',
                $this->menu_slug.'#license'
            );

            add_submenu_page(
                genie_app()->getTextDomain(),
                esc_html__("Help | Get Genie", 'getgenie'),
                esc_html__("Help", 'getgenie'),
                'manage_options',
                $this->menu_slug.'#help' 
            ); 

            $this->removeFirstSubMenu();
        });
    }

    /**
     *remove first sub-menu
     */
    public function removeFirstSubMenu()
    {
        remove_submenu_page('getgenie', 'getgenie');
    }


    /**
     * set content for Get Genie dashboard
     */
    public function writeForMePageData()
    {
        return genie_view('admin/default');
    }


    /**
     * set content for history menu
     */
    public function historyPageData()
    {
        return genie_view('admin/default');
    }

    /**
     * set content for settings menu
     */
    public function settingsPageData()
    {
        return genie_view('admin/default');
    }

    /**
     * set content for license menu
     */
    public function licensePageData()
    {
        return genie_view('admin/default');
    }

    /**
     * set content for help menu
     */
    public function helpPageData()
    {
        return genie_view('admin/default');
    }

}

