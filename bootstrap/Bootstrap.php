<?php

namespace GenieAi\Bootstrap;

class Bootstrap
{

    public static function init($path)
    {
        /**
         * get application instance
         */
        $app = Application::getInstance($path);

        /**
         * register activation hook
         * run only when plugin activate
         */
        register_activation_hook($path, [new Activation(), 'index']);

        /**
         * register de-activation hook
         * run only when plugin de-activate
         */
        register_deactivation_hook($path, [new DeActivation(), 'index']);

        /**
         * Start application with container and boot service providers
         */
        add_action('plugins_loaded', function () use ($app) {
                $app->init();
        },100);
    }

}