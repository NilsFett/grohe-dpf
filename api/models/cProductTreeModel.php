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
class cProductTreeModel extends cModel{

	protected $aColumns = array(
		'id' => array(
			'value' => false,
			'type' => 'int'
		),
		'name' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'parent' => array(
			'value' => false,
			'type' => 'int'
		),
		'hide' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'sorting' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'deleted' => array(
			'value' => false,
			'type' => 'int'
		)
	);
	static $sTable = 't_product_tree';
	protected $sPrimary = 'id';

	public function __construct($aData = false){
		parent::__construct($aData);
	}

	public static function getAll(){
		$db = cDatabase::getInstance();
		$oPDO = $db->hConnection->prepare( 'SELECT * FROM
																				`'.static::$sTable.'`
																				WHERE 1
																				ORDER BY parent, sorting', array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
		$oPDO->execute(  );
		$aResult = array();
		while( $row = $oPDO->fetch(PDO::FETCH_ASSOC) ){
			$aResult[] = $row;
		}
		return $aResult;
	}
}
