<?php

define('SYSTEM_MESSAGE', 1);
class cSystemLog extends cModel{
	static $oInstance = NULL;
	
	public function __construct(){
		parent::__construct(array());

	}
	
	static public function getInstance(){
		if(self::$oInstance == NULL){
			return new cSystemLog();
		}
		return self::$oInstance;
	}
	
	public static function log($text,$importance,$type){
		$oDB = new cDatabase();
		
		$aColNames = array('text','timestamp','type','importance');
		$aColValues = array(':text',':timestamp',':type',':importance');
		$aColsValuePairs = array();
		$aColsValuePairs[':text'] = $text;
		$aColsValuePairs[':timestamp'] = time();
		$aColsValuePairs[':type'] = $type;
		$aColsValuePairs[':importance'] = $importance;
		$oPDO = $oDB->hConnection->prepare( 'INSERT INTO `systemlog` ( '.(implode(',', $aColNames).' ) VALUES ( '.implode(',', $aColValues).' )' ), array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );		
		$result = $oPDO->execute( $aColsValuePairs );
	}
	
	public static function systemMessage($text,$importance){
		self::log($text,$importance,SYSTEM_MESSAGE);
	}
	
}
