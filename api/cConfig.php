<?php
/*
Copyright (c) 2018 Nils Fett

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
class cConfig{

	static $oInstance = NULL;

	private $aConfig = array();


	private function __construct(){
		$this->aConfig['debug'] = false;

		$this->aConfig['senderMail'] = 'mail@nils-fett.de';
		$this->aConfig['hosts'] = array(
			'groheapi.localdomain' => 'groheapi'
			 //everything.localdomain
		);
		$this->aConfig['dbname'] = 'grohe';
		$this->aConfig['user'] = 'root';
		$this->aConfig['password'] = 'x_aBf%@';

		$this->aConfig['basepath'] = '/home/nils/workspace/grohe-dpf/api/';
		

	}

	static public function getInstance(){
		if(self::$oInstance == NULL){
			self::$oInstance = new cConfig();
		}
		return self::$oInstance;
	}

	public function get($sKey = NULL){		
		if($sKey == NULL){
			return $this->aConfig;
		}
		if(isset($this->aConfig[$sKey])){
			return $this->aConfig[$sKey];
		}
		else{
			return false;
		}
	}
}

/* MWS */
define ('DATE_FORMAT', 'Y-m-d\TH:i:s\Z');
define('AWS_ACCESS_KEY_ID', 'AKIAJGJL2MKUPG75XPOQ');
define('AWS_SECRET_ACCESS_KEY', '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');

define('APPLICATION_NAME', 'MWS Reporter');
define('APPLICATION_VERSION', '0.1');
    
define ('MERCHANT_ID', 'A1Q7HF98VTYCCR');

/* AWS */
/*
define ('AWS_ACCESS_KEY', 'AKIAII43RQXR67TJ7IIA');
define ('AWS_SECRET_KEY', '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');
define ('ASSOCIATE_TAG', 'httpswwwwank-21');
*/
