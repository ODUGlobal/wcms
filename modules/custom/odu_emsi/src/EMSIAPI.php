<?php

namespace Drupal\odu_emsi;

use kamermans\OAuth2\GrantType\ClientCredentials;
use kamermans\OAuth2\OAuth2Middleware;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Client;

/**
 * EMSI API test code for ODU.
 *
 * Pull program info from https://api.emsicc.com/programs/odu.
 * "code" element contains EE ID of program.
 * see sample output on:
 * https://odu.emsicc.com/careers/advertising-and-promotions-manager.
 */
class EMSIAPI {

  /**
   * The API client.
   *
   * @var GuzzleHttp\Client
   */
  protected $client;

  /**
   * Initialize.
   */
  public function __construct() {
    // Set up Oauth2 middleware for API client.
    $config = \Drupal::config('odu_emsi.settings');
    $reauth_client = new Client([
      'base_uri' => 'https://auth.emsicloud.com/connect/token',
    ]);
    $reauth_config = [
      "client_id" => $config->get('client_id'),
      "client_secret" => $config->get('client_secret'),
      "scope" => "careers programs",
    ];

    \Drupal::logger('credentials')->notice(print_r($reauth_config, true));

    $grant_type = new ClientCredentials($reauth_client, $reauth_config);
    $oauth = new OAuth2Middleware($grant_type);
    $stack = HandlerStack::create();
    $stack->push($oauth);

    $this->client = new Client([
      'handler' => $stack,
      'auth'    => 'oauth',
    ]);
  }

  /**
   * Main implementation for import.
   *
   * Pulls down list of all defined programs
   * and for each one pulls local career data for ODU.
   */
  public function getProgramData() {
    $results = new \stdClass();
    $results->data = [];

    for ($i = 0; $i <= 2; $i++) {
      $uri = '/programs/odu';
      $querystring = 'onet=2019&limit=50&offset=' . ($i * 50);
      $program_results = $this->sendRequest($uri, $querystring);
      foreach ($program_results->data as $program) {
        $results->data[] = $program;
      }
    }

    for ($i = 0; $i < count($results->data); $i++) {
      $careers = [];
      foreach ($results->data[$i]->attributes->careers as $career_id) {
        $careers[] = $this->getCareerData($career_id);
      }
      $results->data[$i]->attributes->careers = $careers;
      // Fields info comes from https://ccapi.emsicc.com/cccareersapi, under career data.
    }
    return $results;
  }

  /**
   * Gets the list of career codes for a given program.
   *
   * Possibly deprecated now that we are caching that data during import.
   */
  public function getCareersForProgram($slug) {
    $uri = '/programs/odu/' . $slug . '?onet=2019';
    $results = $this->sendRequest($uri);
    return $results->data->attributes->careers;
  }

  /**
   * Utility method to transform a career code to an EMSI slug.
   *
   * Possibly deprecated now that we are caching that data during import.
   */
  public function eeIdToEmsiSlug($entry_id) {
    $uri = '/programs/odu?onet=2019';
    $results = $this->sendRequest($uri);
    foreach ($results->data as $program) {
      if ($program->attributes->code == $entry_id) {
        return $program->id;
      }
    }
    return FALSE;
  }

  /**
   * Get data for career code.
   *
   * Given a career code and msa, pulls down regional data for that career
   * Saves a pared-down version of the data to the database.
   */
  public function getCareerData($career_id, $region_id = '47260') {

    // https://api.emsicc.com/careers/us/msa/47260/11-1011.03?fields=title,description,annual-earnings,typical-ed-level,title-slug
    // Build URL to check.
    $uri = '/careers/us/msa/' . $region_id . '/' . $career_id;
    $querystring = 'onet=2019&fields=title,description,median-earnings,annual-openings,typical-ed-level,title-slug';

    // Checks the cache and uses that data if possible.  Otherwise pulls from remote
    // and caches that data
    // if (!$this->cache_check($career_id)){
    $career_data = $this->sendRequest($uri, $querystring);
    $career_data_simplified = [
      'career_id' => $career_id,
      'title' => $career_data->data->attributes->{'title'},
      'description' => $career_data->data->attributes->{'description'},
      'median-earnings' => $career_data->data->attributes->{'median-earnings'},
      'annual-openings' => $career_data->data->attributes->{'annual-openings'},
      'typical-ed-level' => $career_data->data->attributes->{'typical-ed-level'},
      'title-slug' => $career_data->data->attributes->{'title-slug'},
    ];

    // $this->career_cache[$career_id]=$career_data_simplified;.
    // } else {.
    // $career_data_simplified = $this->career_cache[$career_id];
    // }.
    return $career_data_simplified;
  }

  /**
   * Sends API requests to EMSI service via CURL w/ appropriate API key.
   */
  private function sendRequest($uri, $querystring = '') {

    // Curl setup.
    $curl = curl_init();
    $url = "https://cc.emsiservices.com" . $uri . ($querystring ? "?" . $querystring : '');

    // Request send.
    try {
      $response = $this->client->get($url);
    }
    catch (\Exception $e) {
      \Drupal::logger('emsi_import')->warn('EMSI http error: ' . $e);
    }
    return json_decode($response->getBody());
  }

}
