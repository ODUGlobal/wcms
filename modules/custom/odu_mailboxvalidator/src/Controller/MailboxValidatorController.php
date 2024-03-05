<?php 
namespace Drupal\odu_mailboxvalidator\Controller;
use Drupal\Core\Controller\ControllerBase;
use MailboxValidator\SingleValidation;

class MailboxValidatorController extends ControllerBase {


    public function __construct() {
    }


    private function endswith($string, $test) {
        $strlen = strlen($string);
        $testlen = strlen($test);
        if ($testlen > $strlen) return false;
        return substr_compare($string, $test, $strlen - $testlen, $testlen) === 0;
    }
    
    
    
    private function in_whitelist($email){
        
        $whitelist = explode("\n", \Drupal::config('odu_mailboxvalidator.settings')->get('whitelist'));
       
        foreach ($whitelist as $whitelist_entry){
            if ($this->endswith($email,trim($whitelist_entry))){
                return true;
            }
        }
        return false;
    }

    /**
     * Validate an email against the mailboxvalidator email service, returns http codes appropriate for use with FormAssembly form service
     * 
     * Requires mailboxvalidator/mailboxvalidator-php package from packageist:
     * https://packagist.org/packages/mailboxvalidator/mailboxvalidator-php
     * 
     */
    public function validate() {
        $config = \Drupal::config('odu_mailboxvalidator.settings');

        $mbv = new SingleValidation($config->get('api_key'));
        $results = $mbv->ValidateEmail($_POST['email']);
        
        if ($results === false) {
            header("HTTP/1.1 400 Bad Request");
            $message = 'Error connecting to API.';
            \Drupal::logger('odu_mailboxvalidator')->error($message); //log if we can't connect to service
            echo $message;
            exit;
        } else if (($results->status == 'True' || $this->in_whitelist($_POST['email'])==true)) {
            header("HTTP/1.1 200");
            exit;
        } else {
            header("HTTP/1.1 400 Bad Request");
            \Drupal::logger('odu_mailboxvalidator')->error($_POST['email'].' - '.print_r($results, TRUE)); //log error from service
            echo ' - Invalid email';
            exit;
        }

        return true;
    }
}