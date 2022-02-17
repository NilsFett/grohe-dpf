<?php
class cFileLog {
	static $oInstance = NULL;
	private $nl = '
';
	private $fh;
	
	private function __construct(){
		$this->fh = fopen(cConfig::getInstance()->get('basepath').'log/log.log', 'w+');
		$this->fhhtml = fopen(cConfig::getInstance()->get('basepath').'log/loghtml.html', 'w+');
	}
	
	static public function getInstance(){
		if(self::$oInstance == NULL){
			self::$oInstance = new cFileLog();
		}
		return self::$oInstance;
	}
	
	public function log($data){
		if( is_array($data) || is_object($data) ){
			$data = print_r($data, true);
		}
		
		fwrite($this->fh , $data.$this->nl);
	}
	
	public function logHTML($data){
		if( is_array($data) || is_object($data) ){
			$data = print_r($data, true);
		}
		
		fwrite($this->fhhtml , $data);
	}
	
	public function __destruct(){
		fclose($this->fh);
	}
}
