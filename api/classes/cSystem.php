<?php
/*
Copyright (c) 2014 Nils Fett

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
class cSystem{	
	static $oInstance = NULL;

	private $sEnviroment;
	private $sLanguage;
	private $sCurrentAction;
	private $sSessionId;
	private $requestURI;
	private $modifiedRequestURI;	
	private $aErrors;
	private $bGeneratingForApp;
	private $sAppFilesUrl;
	
	public function init(){

		if(! isset($_SESSION['errors'])){
			$_SESSION['errors'] = array();
		}
		
		/* Routing: Anhand der URI wird festgestellt, in welcher Umgebung man ist ( gedumoxin, rexitamol usw. ), welche Sprache benutzt wird und welche Action vom FrontController durchgeführt wird. */
		
		// ENVIROMENT
		$aHosts = cConfig::getInstance()->get('hosts');

		if(isset($aHosts[$_SERVER['HTTP_HOST']])){
			$this->sEnviroment = cConfig::getInstance()->get('hosts')[$_SERVER['HTTP_HOST']];
		}
		else{
			throw new Exception('System Fehler: Kann Umgebung nicht feststellen. HTTP_HOST wurde nicht in der cConfig gefunden.');
		}

		// Request URI von Parametern bereinigen

		$this->requestURI = $_SERVER['REQUEST_URI'];
		
		
		$temp = explode('?', $this->requestURI);
		if(count($temp)){
			$this->requestURI = $temp[0];
		}

		$this->modifiedRequestURI = $this->requestURI;

		$this->modifiedRequestURI = str_replace('/api', '' , $this->modifiedRequestURI);


		// ACTION		
		$oActions = new cActionsModel();
		$this->aActions = $oActions->getActionsByEnviromentName($this->sEnviroment);

		$this->sAction = 'index';

		if($this->aActions){
			foreach($this->aActions as $actionName => $action){
				if($action['url'] == $this->modifiedRequestURI){
					$this->sAction = $actionName;
					$this->aAction = $action;
				}
			}
		}
	}
	
	static public function getInstance(){
		if(self::$oInstance == NULL){
			self::$oInstance = new cSystem();
		}
		return self::$oInstance;
	}
	
	public function getAction(){
		return $this->sAction;
	}
	
	public function getActionId(){
		return $this->aAction['id'];
	}
	
	public function getEnviromentActions(){
		return $this->aActions;
	}	
	
	/* TODO:
	 * Lade Enviromens aus Tabelle enviroments */
	public function getEnviroment(){
		return $this->sEnviroment;
	}
	
	public function getEnviromentId(){
		return 1;
	}	
	

	
	public function getPageURL($action){
		if(isset($this->aActions[$action])){
			$params = '?sessionid='.session_id();

			return cConfig::getInstance()->get('root').'api'.$this->aActions[$action]['URL'].$params;			
		}
	}
	

	
}
