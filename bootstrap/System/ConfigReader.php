<?php


namespace GenieAi\Bootstrap\System;

use GenieAi\App\Utilities\Traits\Singleton;

class ConfigReader
{
    use Singleton;

    /**
     * @var
     */
    protected $filePath;

    /**
     * @var string
     */
    protected $fileExtension = '.php';


    /**
     * @var array
     */
    private $data = [];

    /**
     * @var array
     */
    private $fileData = [];


    /**
     * @param $key
     * @return array|mixed|null
     */
    public function get($key)
    {

        if (isset($this->data[$key])) {
            return $this->data[$key];
        }

        $key_tree = explode('.', $key);

        $fileName = $key_tree[0];
        $filePath = $this->filePath($fileName);

        if (is_file($filePath)) {

            $data = $this->set_data($this->filePath($fileName), $fileName);
            unset($key_tree[0]);

            foreach ($key_tree as $k) {
                $data = $data[$k] ?? '';
            }

            $this->data[$key] = $data;
            return $data;

        } else {
            return '';
        }
    }

    /**
     * @param $file
     * @return string
     */
    protected function filePath($file)
    {
        return genie_app()->getBasePath('config'.DIRECTORY_SEPARATOR.$file.$this->fileExtension);
    }

    /**
     * @param $filePath
     * @param $key
     * @return mixed
     */
    protected function set_data($filePath, $key)
    {

        if (!isset($this->fileData[$key])) {
            $this->fileData[$key] = include $filePath;
        }

        return $this->fileData[$key];
    }

}