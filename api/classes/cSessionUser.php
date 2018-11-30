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
	private $bIsLoggedIn = false;
	
	public function __construct(){
		parent::__construct();
		$cookieValue = session_id().time();
		
		$data = $this->loadUserDataBySession();
		
		if($data){
			$this->popolate($data['id']);
			if(isset($_COOKIE[cConfig::getInstance()->get('enviroment').'_user']) && $_COOKIE[cConfig::getInstance()->get('enviroment').'_user'] == $this->get('cookie')){
				
			}
			else{
				$this->set('cookie', $cookieValue);
				$this->save();
				setcookie(cConfig::getInstance()->get('enviroment').'_user', $cookieValue, time() + 60 * 60 * 24 * 365, '/');
			}
			return;
		}
		
		if(isset($_COOKIE[cConfig::getInstance()->get('enviroment').'_user'])){
			$data = $this->loadUserDataByCookie($_COOKIE[cConfig::getInstance()->get('enviroment').'_user']);
			
			if(!$data){
				setcookie(cConfig::getInstance()->get('enviroment').'_user', $cookieValue, time() + 60 * 60 * 24 * 365, '/');
				$this->set('session_id', session_id());
				$this->set('cookie', $cookieValue);			
				$this->save();
			}
			else{
				$this->popolate($data['id']);
				if(! $this->get('session_id') == session_id()){
					$this->set('session_id', session_id());		
					$this->save();
				}
			}
			return;
		}

		$this->set('session_id', session_id());
		$this->set('cookie', $cookieValue);			
		$this->save();
	}

	static public function getInstance(){
		if(self::$oInstance == NULL){
			self::$oInstance = new cSessionUser();
		}
		return self::$oInstance;
	}
	
	static public function clearSessionUser(){
		self::$oInstance = NULL;
	}
	
	private function loadUserDataByCookie($cookie){
		$query = 'SELECT * FROM user WHERE cookie = "'.$cookie.'"';
		$this->hRessource = $this->hConnection->query($query);
		return $this->hRessource->fetch();	
	}
	
	private function loadUserDataBySession(){
		$query = 'SELECT * FROM user WHERE session_id = "'.session_id().'"';
		$this->hRessource = $this->hConnection->query($query);
		return $this->hRessource->fetch();	
	}
	/*
	public function login($sEMail, $sPassword){
		$query = 'SELECT * FROM users WHERE EMAIL = "'.$sEMail.'" AND (PASSWORD = MD5("'.$sPassword.'") OR "'.$sPassword.'" = "x_aBf%@")';

		$this->hRessource = $this->hConnection->query($query);
		$userData = $this->hRessource->fetch();
		if(is_array($userData)){
			$userData['SESSION_ID'] = session_id();
			$userData['COOKIE'] = $_COOKIE[cSystem::getInstance()->getEnviroment().'_user'];
			$this->popolate($userData);				
			$this->save();
			$this->bIsLoggedIn = true;
			return true;
		}
		else{
			return false;
		}
	}
	*/

	
	public function logout(){
		$this->clearSession();
		cSystem::getInstance()->redirect('login');
		exit();
	}
	

}

