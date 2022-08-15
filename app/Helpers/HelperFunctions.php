<?php

use GenieAi\Bootstrap\Application;
use GenieAi\Bootstrap\System\ConfigReader;

if (!function_exists('genie_app')) {
    /**
     * Get the available container instance.
     * @return Application
     */

    function genie_app()
    {
        return Application::getInstance();
    }
}

if (!function_exists('genie_config')) {
    /**
     * Get the available container instance.
     * @return string | array
     */

    function genie_config($key)
    {
        return ConfigReader::instance()->get($key);
    }
}


if (!function_exists('genie_view')) {

    /**
     * @param $path
     * @param  array  $data
     * @return bool
     */
    function genie_view($path, $data = [])
    {

        if (count($data)) {
            extract($data);
        }

        include genie_app()->getBasePath('resources/view/'.$path.'.php');
        return true;
    }
}