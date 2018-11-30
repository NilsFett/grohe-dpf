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
class cDisplaysPartsModel extends cModel{

	protected $aColumns = array(
		'id' => array(
			'value' => false,
			'type' => 'int'
		),
		'title' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'articlenr' => array(
			'value' => false,
			'type' => 'int'
		),
		'open_format' => array(
			'value' => false,
			'type' => 'int'
		),
		'stock' => array(
			'value' => false,
			'type' => 'int'
		),
		'weight' => array(
			'value' => false,
			'type' => 'int'
		),
		'deleted' => array(
			'value' => false,
			'type' => 'int'
		)
	);
	static $sTable = 't_display_parts';
	protected $sPrimary = 'id';
	
	public function __construct($aData = false){
		parent::__construct($aData);
	}

	public static function getPartsToDisplays(){
		$query = '	SELECT *
					FROM `t_displays`
					LEFT JOIN `r_display_parts` ON (`t_displays`.id = `r_display_parts`.`display_id`)
					LEFT JOIN `t_display_parts` ON ( `r_display_parts`.`part_id` = `t_display_parts`.`id` )';
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute();	
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	/*
	public static function getAll(){
		$query = '	SELECT *
					FROM `t_displays`';
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute();		
		$displays = array();
		while( $display = $stmt->fetch(PDO::FETCH_ASSOC) ){
			$displays[$display['id']] = $display;
		}
		return $displays;
	}
	*/
}
