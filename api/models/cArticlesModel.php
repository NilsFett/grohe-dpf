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
class cArticlesModel extends cModel{

	protected $aColumns = array(
		'id' => array(
			'value' => false,
			'type' => 'int'
		),
		'articlenr' => array(
			'value' => false,
			'type' => 'int'
		),
		'title' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'extra' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'type' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'packaging' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'weight' => array(
			'value' => false,
			'type' => 'int'
		),
		'topsign' => array(
			'value' => false,
			'type' => 'int'
		),
		'height' => array(
			'value' => false,
			'type' => 'int'
		),
		'width' => array(
			'value' => false,
			'type' => 'int'
		),
		'depth' => array(
				'value' => false,
				'type' => 'int'
			),
		'deleted' => array(
			'value' => false,
			'type' => 'int'
		),
		'old_system' => array(
			'value' => false,
			'type' => 'int'
		)
	);
	static $sTable = 't_articles';
	protected $sPrimary = 'id';

	public function __construct($aData = false){
		parent::__construct($aData);
	}

	public static function getAll(){
		$query = '	SELECT *
					FROM `'.self::$sTable.'`
					WHERE `old_system` = 0';
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute();
		$displays = array();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}


	public static function getByProductId($productId){
		$query = '	SELECT `t_articles`.*, `r_display-article`.`units`
								FROM `t_articles`
								JOIN `r_display-article` ON `r_display-article`.`article_id` = `t_articles`.`id`
								JOIN `t_display_position` ON `r_display-article`.`position` = `t_display_position`.`id`
								WHERE `t_display_position`.`id` = '.$productId;
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute();
		$products = array();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
		while( $product = $stmt->fetch(PDO::FETCH_ASSOC) ){
			$products[] = $product;
		}
		return $products;
	}

}
