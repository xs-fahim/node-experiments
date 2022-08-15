<?php


use GenieAi\App\Providers\EnqueueProvider;
use GenieAi\App\Providers\SideMenuProvider;

return [
    'text_domain' => 'getgenie',
    'version' => GETGENIE_VERSION,
    'api_prefix' => 'getgenie',
    'api_version' => 'v1',
    'providers' => [
        EnqueueProvider::class,
        SideMenuProvider::class,
    ],
    'product' => [
        'product_id' => '126109',
        'author_name' => 'GetGenie',
        'store_name' => 'GetGenie',
        'api_url' => 'https://api.getgenie.ai/public/',
        'account_url' => 'https://api.getgenie.ai/public/',
        'landing_page' => 'https://getgenie.ai/',
    ]
];