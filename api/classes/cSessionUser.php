<?php
/*
Copyright (c) 2017 Nils Fett

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
class cSessionUser extends cUserModel{
	static $oInstance = NULL;
	public $bIsLoggedIn = false;

  private $cookieValue = NULL;

	public function __construct(){
		parent::__construct();
		$this->cookieValue = session_id().time();



		if(! isset($_COOKIE[cConfig::getInstance()->get('enviroment').'_user']) ){
			setcookie(cConfig::getInstance()->get('enviroment').'_user', $this->cookieValue,
				[
					'path'=>'/',
					'expires'=> time() + 60 * 60 * 24 * 365,
					'samesite' => 'None',
					'secure' => true,
					'httponly' => true,
				'domain' => 'grohe.hoehne-media.de']);
			//setcookie('cross-site-cookie', 'name', ['expires'=> time() + 60 * 60 * 24 * 365,,'samesite' => 'None', 'secure' => true]);
		}


		$data = $this->loadUserDataBySession();

		if($data){
			$this->popolate($data);
			if( isset($_COOKIE[cConfig::getInstance()->get('enviroment').'_user']) && $_COOKIE[cConfig::getInstance()->get('enviroment').'_user'] == $this->get('cookie')){

			}
			else{
				$this->set('session_id', session_id());
				$this->set('cookie', $this->cookieValue);
				$this->save();
			}
			$this->bIsLoggedIn = true;
			return;
		}

		if(isset($_COOKIE[cConfig::getInstance()->get('enviroment').'_user'])){
			$data = $this->loadUserDataByCookie($_COOKIE[cConfig::getInstance()->get('enviroment').'_user']);

			if(!$data){

			}
			else{
				$this->popolate($data);

				$this->set('session_id', session_id());
				$this->set('cookie', $this->cookieValue);
				$this->save();

				$this->bIsLoggedIn = true;
			}
			return;
		}


/*
		$this->set('session_id', session_id());
		$this->set('cookie', $this->cookieValue);
		$this->save();
		*/
	}

	static public function getInstance(){
		if(self::$oInstance == NULL){
			self::$oInstance = new cSessionUser();
		}
		return self::$oInstance;
	}

	public function clearSessionUser(){
		self::$oInstance = NULL;
		$this->set('session_id', NULL);
		$this->set('cookie', NULL);
		$this->save();
		$this->bIsLoggedIn = false;
	}

	public function login($mail, $password){
		if(parent::login($mail, $password)){
			$this->set('session_id', session_id());
			$this->set('cookie', $this->cookieValue);
			$this->save();
			$this->bIsLoggedIn = true;
			return true;
		}
		return false;
	}

	public function logout(){
		$this->clearSessionUser();
	}


}
