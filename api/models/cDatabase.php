<?php
class cDatabase{
	static $oInstance = NULL;
	
	public function __construct($aConfig = false){
		$oConfig = cConfig::getInstance();
		
		if(is_array($aConfig)){
			$h = $aConfig['host'];
			$d = $aConfig['dbname'];
			$u = $aConfig['user'];
			$p = $aConfig['password'];
		}
		else{
			$h = $oConfig->get('host');
			$d = $oConfig->get('dbname');
			$u = $oConfig->get('user');
			$p = $oConfig->get('password');
		}
		
		$this->hConnection = new PDO( 'mysql:host='.$h.';dbname='.$d.';charset=UTF8', $u, $p, array(PDO::ATTR_PERSISTENT => true));
		$this->hConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$this->hConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
	}

   function __destruct() {
       $this->hConnection = null;
   }
   
  	static public function getInstance(){
		if(self::$oInstance == NULL){
			return new cDatabase();
		}
		return self::$oInstance;
	}
}
