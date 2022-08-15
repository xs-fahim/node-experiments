<?php

namespace GenieAi\Bootstrap;


class Application
{

    /**
     * @var null|object
     */
    public static $instance = null;

    /**
     * @var string
     */
    private $pluginFile;

    /**
     * @var string
     */
    private $basePath;

    /**
     * @var string
     */
    private $baseName;

    /**
     * @var string
     */
    private $baseUrl;

    /**
     * @var string
     */
    private $version;


    public function __construct($path)
    {
        $this->pluginFile = $path;
    }

    /**
     * @set application base path ( Plugin directory path )
     * @set pluginFile
     * @set pluginBasename
     *
     * @param  string  $path
     *
     * @return void
     */
    private function setBasePath($path)
    {
        $this->basePath = untrailingslashit(plugin_dir_path($path));
        $this->baseName = plugin_basename($path); 
        $this->baseUrl = plugin_dir_url($path);
    }

    /**
     * Initiate all service provider
     */
    public function init()
    {

        $this->version = genie_config('app.version');
        $this->setBasePath($this->pluginFile);

        $serviceProviders = genie_config('app.providers');
        if (!is_array($serviceProviders)) {
            $serviceProviders = [];
        }

        $method = 'boot';

        foreach ($serviceProviders as $serviceProvider) {
            $instance = new $serviceProvider();
            $instance->$method();
        }
    }

    /**
     * @param $path
     * @param $version
     *
     * @return Application
     */
    public static function getInstance($path = null, $version = null)
    {
        if (null === self::$instance) {
            self::$instance = new self($path, $version);
        }

        return self::$instance;
    }

    /**
     * get base url of plugin
     * @param  string
     * @return string
     */
    public function getBaseUrl($path)
    {
        return $this->baseUrl.($path ? '/'.$path : '');
    }

    /**
     * get base url of plugin
     * @param  null  $path
     * @return string
     */
    public function getBasePath($path = null)
    {
        return $this->basePath.($path ? DIRECTORY_SEPARATOR.$path : '');
    }

    /**
     * get base name of plugin 
     * @return string
     */
    public function getBaseName()
    {
        return $this->baseName;
    }

    /**
     * get text-domain
     * @return string
     */
    public function getTextDomain()
    {
        return genie_config('app.text_domain');
    }

    /**
     * get version
     * @return string
     */
    public function getVersion()
    {
        return $this->version;
    }


    /**
     * get plugin File Path
     * @return string
     */
    public function pluginFilePath()
    {
        return $this->pluginFile;
    }

    /**
     * @return string
     * product id for license manager
     */
    public function product_id()
    {
        return genie_config('app.product.product_id');
    }

    /**
     * license manager Author name
     * @return string
     */
    public function author_name()
    {
        return genie_config('app.product.author_name');
    }

    /**
     * license manager store name
     */
    public function store_name()
    {
        return genie_config('app.product.store_name');
    }


    /**
     * license manager API Url
     */
    public function api_url()
    {
        return genie_config('app.product.api_url');
    }

    /**
     * Account url
     * @var string for plugin update notification, user account page.
     */
    public function account_url()
    {
        return genie_config('app.product.account_url');
    }


    public function landing_page($part = '')
    {
        return trailingslashit(genie_config('app.product.landing_page').$part);
    }

}