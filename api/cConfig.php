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


		$this->aConfig['enviroment'] = 'grohedpf';
		$this->aConfig['senderMail'] = 'mail@nils-fett.de';

		// Host -> environment map. The environment name selects the controller
		// (c<Env>Controller) and the `enviroments` table row used for routing.
		// In Docker the public domain is injected via APP_HOST.
		$this->aConfig['hosts'] = array(
			'groheapi.localdomain' => 'groheapi'
			 //everything.localdomain
		);
		$appHost = getenv('APP_HOST');
		if ($appHost) {
			$this->aConfig['hosts'][$appHost] = getenv('APP_ENV_NAME') ?: 'groheapi';
		}

		// Database + paths. Defaults preserve the original local setup; Docker
		// overrides them through environment variables (see docker-compose.yml).
		$this->aConfig['dbname']   = getenv('DB_NAME') ?: 'grohe-dpf';
		$this->aConfig['user']     = getenv('DB_USER') ?: 'root';
		$this->aConfig['password'] = (getenv('DB_PASSWORD') !== false) ? getenv('DB_PASSWORD') : 'iCasaful:06123';
		$this->aConfig['host']     = getenv('DB_HOST') ?: 'localhost';

		$this->aConfig['basepath'] = getenv('APP_BASEPATH') ?: '/home/nils/workspace/grohe-dpf/api/';

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
