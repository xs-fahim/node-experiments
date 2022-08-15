<?php

namespace GenieAi\App\Api;

class License
{

    public $prefix = '';
    public $param = '';
    public $request = null;

    public function __construct() {
        add_action('rest_api_init', function() {
            register_rest_route('getgenie/v1/license', '(?P<action>[\w-]+)', array(
                'methods'  => \WP_REST_Server::ALLMETHODS,
                'callback' => [$this, 'action'],
                'permission_callback' => '__return_true',
            ));
        });
    }


    public function action($request) 
    {
        if ( !wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' ) ) {
            return [
                'status'    => 'fail',
                'message'   => ['Nonce mismatch.']
            ];
        }

        if ( !is_user_logged_in() || !current_user_can('edit_posts')) {
            return [
                'status'    => 'fail',
                'message'   => ['Access denied.']
            ];
        }

        switch($request['action']){
             case 'get-token':
                $remote_url = GETGENIE_ACCOUNT_REMOTE_ADDR . 'wp-json/v1/manage-site/license_active';
                $body = $request->get_body(); 

                $response = wp_remote_post($remote_url, array(
                    'method'      => 'POST',
                    'timeout'     => 300,
                    'redirection' => 3,
                    'httpversion' => '1.0',
                    'sslverify' => false,
                    'blocking'    => true,
                    'body' => $body,
                    'headers' => array(
                        'Content-Type' => 'application/json',
                    ),
                ));

                if(200 === wp_remote_retrieve_response_code($response)) {
                    $response_body = json_decode(wp_remote_retrieve_body($response));
                    error_log(print_r($response_body, true));
                    $token      = isset($response_body->data) ? $response_body->data->siteToken : '';
                    $authTokenSecretKey  = isset($response_body->data) ? $response_body->data->authTokenSecretKey : '';

                    if($token != '') {
                        update_option('getgenie_site_token', $token);
                        update_option('getgenie_auth_token_secret_key', $authTokenSecretKey);
                        return [
                            "status" => "success",
                            "message" => [
                                "License has been activated"
                            ]
                        ];
                    }

                    return [
                        "status" => "fail",
                        "message" => [
                            isset($response_body->message[0]) ? $response_body->message[0] : "Invalid license key"
                        ]
                    ];
                }
                break;

            case 'remove-token':
                delete_option('getgenie_site_token');
                delete_option('getgenie_auth_token_secret_key');
                return [
                    "status" => "success",
                    "message" => [
                        "License has been deactivated"
                    ]
                ];
                break;

        }

        return [
            "status" => "fail",
            "message" => [
                "Remote connection timeout"
            ]
        ];
    }
}