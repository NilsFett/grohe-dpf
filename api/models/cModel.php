<?php
/*
Copyright (c) 2011 Nils Fett

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
class cModel extends cDatabase{
	protected $bHasChanged = false;
	protected $bIsNew = true;
	protected $aColumns = array();
	protected $sOrderBy = false;
	protected $bASC = false;

	public function __construct($aData){
		parent::__construct();
		if($aData)
			$this->popolate($aData);
	}


	public function getFT($sTableName){
		$query =  'SELECT `'.$sTableName.'`.*
						FROM `'.$sTableName.'`,`'.$this->sTable.'`
						WHERE `'.$this->sTable.'`.`'.$this->foreignTables[$sTableName][0].'` = `'.$sTableName.'`.`'.$this->foreignTables[$sTableName][1].'`
						AND `'.$this->sTable.'`.'.$this->sPrimary. ' = '.$this->aColumns[$this->sPrimary]['value'];
		$oPDO = $this->hConnection->prepare( $query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
		try{
			$oPDO->execute(  );
		}
		catch(Exception $e){
			echo $query;
			print_r($e);
			exit();
		}

		$aRows = $oPDO->fetchAll();
		if(!$aRows){
			return array();
		}
		$classname = $this->foreignTables[$sTableName][2];
		$aObjects = array();
		foreach( $aRows as $aRow){
			$aObjects[] = new $classname($aRow);
		}

		return $aObjects;
	}

	protected function popolate($aData){
		if( is_array($aData) ){
			if(isset($this->sPrimary)){
				if(isset($aData[$this->sPrimary])){
					$this->aColumns[$this->sPrimary]['value'] = $aData[$this->sPrimary];
					$this->bIsNew = false;
				}
			}
			foreach( $this->aColumns as $sColumn => $sValue ){
				if(isset($aData[$sColumn])){
					$this->aColumns[$sColumn]['value'] = $aData[$sColumn];
				}
			}
		}
		else if( is_numeric( $aData ) ){
			$oPDO = $this->hConnection->prepare( 'SELECT * FROM `'.static::$sTable.'` WHERE '.$this->sPrimary.' = '.( $aData * 1 ), array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
			$oPDO->execute(  );
			$aData = $oPDO->fetchAll();


			if(empty($aData)){
				$this->bIsNew = true;
				return;
			}
			else{
				$aData = $aData[0];
			}
			if(isset($this->sPrimary))
				$this->aColumns[$this->sPrimary]['value'] = $aData[$this->sPrimary];
			foreach( $this->aColumns  as $sColumn => $sValue ){
				$this->aColumns[$sColumn]['value'] = $aData[$sColumn];
			}
			$this->bIsNew = false;
		}
		else{
			$this->bIsNew = true;
		}
	}

	public function data(){
		return $this->aColumns;
	}

	public function set( $sColumn, $sValue ){
		if( $this->aColumns[$sColumn]['value'] === $sValue ){

		}
		else{
			if($this->aColumns[$sColumn]['value'] === false){
				$this->aColumns[$sColumn]['value'] = $sValue;
			}
			else{
				if( is_array($this->aColumns[$sColumn]['value']) ){
					if( ! in_array($sValue, $this->aColumns) ){
						$this->aColumns[$sColumn]['value'][] = $sValue;
					}
				}
				else{

					$this->aColumns[$sColumn]['value'] =$sValue ;

				}
			}
			$this->bHasChanged = true;
		}
		return $this;
	}

	public function orderBy( $sColumn ){
		$this->sOrderBy =$sColumn;
	}

	public function setASC( $bASC ){
		$this->bASC =$bASC;
	}

	public function get( $sColumn ){

		return $this->aColumns[$sColumn]['value'];
	}

	public function save(){
		$aColsValuePairs = array();
		if( $this->bIsNew ){
			$aColNames = array();
			$aColValues = array();

			foreach( $this->aColumns as $sColumn => $sValue){
				if( $sColumn == 'id' || is_array($sValue['value']) ){
					continue;
				}

				if($sValue['type'] == 'int' && ($sValue['value'] === '' || $sValue['value'] === false )){
					continue;
					$sValue['value'] = NULL;
				}
				$aColNames[] = '`'.$sColumn.'`';
				$aColValues[] = ':'.$sColumn;
				$aColsValuePairs[':'.$sColumn] = $sValue['value'];
			}
			if(isset($_GET['debug'])){
				echo '<p>INSERT INTO '.$this->sTable.' ( '.(implode(',', $aColNames)).' ) VALUES ( '.implode(',', $aColValues).' )</p>';

				print_r($aColNames);
				print_r($aColValues);
				print_r($aColsValuePairs);


			}

			$oPDO = $this->hConnection->prepare( 'INSERT INTO `'.static::$sTable.'` ( '.(implode(',', $aColNames).' ) VALUES ( '.implode(',', $aColValues).' )' ), array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );

			$result = $oPDO->execute( $aColsValuePairs );
			if( isset($this->sPrimary)  ){
				$this->aColumns[$this->sPrimary]['value'] = $this->hConnection->lastInsertId();
			}
			$this->bIsNew = false;
		}
		else{
			if($this->bHasChanged){

				$sQuery = 'UPDATE `'.static::$sTable.'` SET ';
				foreach( $this->aColumns as $sColumn => $sValue){
					if( $sColumn == $this->sPrimary  || is_array($sValue['value']) ){
						continue;
					}

					$sQuery .= $sColumn.' = :'.$sColumn.',';

					if($sValue['value'] == 'NULL'){
						$aColsValuePairs[':'.$sColumn] = PDO::PARAM_NULL;
					}
					else{
						if( $sValue['value'] == '' && $sValue['type'] != 'varchar' ){
							$aColsValuePairs[':'.$sColumn] = PDO::PARAM_NULL;
						}
						elseif( ( $sValue['value'] == '0000-00-00 00:00:00' && $sValue['type'] == 'datetime' ) ){
							$aColsValuePairs[':'.$sColumn] = NULL;
						}
						else{
							$aColsValuePairs[':'.$sColumn] = $sValue['value'];
						}

					}
				}
				$sQuery = substr($sQuery, 0, -1);
				$sQuery .= ' WHERE '.$this->sPrimary.' = '.$this->aColumns[$this->sPrimary]['value'];

				if(isset($_GET['debug'])){
					echo '<p>'.$sQuery.'</p>';
				}
				$oPDO = $this->hConnection->prepare( $sQuery , array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
				$oPDO->execute( $aColsValuePairs );
			}
		}
		return $this;
	}

	public function clear(){
		$this->bHasChanged = false;
		$this->bIsNew = true;
		foreach( $this->aColumns as  &$sValue){
			$sValue['value'] = false;
		}
		return $this;
	}

	public static function deleteByID($id){
		$sQuery = 'DELETE FROM '.$this->sTable.' WHERE ID = '.$id;
		if(isset($_GET['debug'])){
			echo '<p>'.$sQuery.'</p>';
		}
		$oPDO = $this->hConnection->prepare( $sQuery , array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
		$x = $oPDO->execute();
		$this->hConnection->commit();
	}

	public function delete(){
		$sQuery = 'DELETE FROM '.static::$sTable.' WHERE ID = '.$this->aColumns[$this->sPrimary]['value'];
		if(isset($_GET['debug'])){
			echo '<p>'.$sQuery.'</p>';
		}
		$oPDO = $this->hConnection->prepare( $sQuery , array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
		$x = $oPDO->execute();
		//$this->hConnection->commit();
	}

	public static function getAll(){
		$db = cDatabase::getInstance();
		$oPDO = $db->hConnection->prepare( 'SELECT * FROM `'.static::$sTable.'` WHERE 1', array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
		$oPDO->execute(  );
		$aResult = array();
		while( $row = $oPDO->fetch(PDO::FETCH_ASSOC) ){
			$aResult[] = $row;
		}
		return $aResult;
	}

	public function getValuesArray(){
		$aValuesArray = array();
		foreach($this->aColumns as $col => $props){
			$aValuesArray[$col] = ($props['value'] === false)?'':$props['value'];
		}
		return $aValuesArray;
	}
}
