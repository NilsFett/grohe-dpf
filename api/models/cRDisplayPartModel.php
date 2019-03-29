<?php
/*
Copyright (c) 2020 Nils Fett

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
class cRDisplayPartModel extends cModel{

	protected $aColumns = array(
		'display_id' => array(
			'value' => false,
			'type' => 'int'
		),
		'part_id' => array(
			'value' => false,
			'type' => 'int'
		),
		'units' => array(
			'value' => false,
			'type' => 'int'
		)
	);
	static $sTable = 'r_display-part';


	public function __construct($aData = false){
		parent::__construct($aData);
	}

	public static function replace($display_id, $part_id, $units){
		$query = '	REPLACE INTO `'.self::$sTable.'`
								SET `display_id` = ?, `part_id` = ?, `units` = ?';
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute(array($display_id, $part_id, $units));

	}

	public static function getAll(){
		$query = '	SELECT *
					FROM `t_display_parts`';
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute();
		$displays = array();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
		while( $display = $stmt->fetch(PDO::FETCH_ASSOC) ){
			$displays[$display['id']] = $display;
		}
		return $displays;
	}

	public static function getByDisplayId($displayId){
		$query = '	SELECT `t_display_parts`.*, `r_display-part`.`units`
								FROM `t_displays`
								JOIN `r_display-part` ON `r_display-part`.`display_id` = `t_displays`.`id`
								JOIN `t_display_parts` ON `r_display-part`.`part_id` = `t_display_parts`.`id`
								WHERE `t_displays`.`id` = '.$displayId;
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute();
		$displays = array();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
		while( $display = $stmt->fetch(PDO::FETCH_ASSOC) ){
			$displays[] = $display;
		}
		return $displays;
	}

}
