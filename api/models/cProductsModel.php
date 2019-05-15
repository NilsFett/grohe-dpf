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
class cProductsModel extends cModel{

	protected $aColumns = array(
		'id' => array(
			'value' => false,
			'type' => 'int'
		),
		'title' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'DFID' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'empty_display' => array(
			'value' => false,
			'type' => 'int'
		),
		'display_id' => array(
			'value' => false,
			'type' => 'int'
		),
		'SAP' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'product_tree' => array(
			'value' => false,
			'type' => 'int'
		),
		'topsign_id' => array(
			'value' => false,
			'type' => 'int'
		),
		'promotion_material_id' => array(
			'value' => false,
			'type' => 'int'
		),
		'price' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'pallet_select' => array(
			'value' => false,
			'type' => 'int'
		),
		'pallet_disabled' => array(
			'value' => false,
			'type' => 'int'
		),
		'topsign_upload_disabled' => array(
			'value' => false,
			'type' => 'int'
		),
		'notopsign_order_disabled' => array(
			'value' => false,
			'type' => 'int'
		),
		'bypack_disabled' => array(
			'value' => false,
			'type' => 'int'
		),
		'deliverytime' => array(
			'value' => false,
			'type' => 'int'
		),
		'image' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'image_thumb' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'hide' => array(
			'value' => false,
			'type' => 'int'
		)
	);
	static $sTable = 't_display_position';
	protected $sPrimary = 'id';

	static $productPaths = array();

	public function __construct($aData = false){
		parent::__construct($aData);
	}

	public static function getAll(){
		$query = '	SELECT `t_display_position`.*, `t_displays`.`base_display_template_id`, `t_displays`.`id`  AS displayID
								FROM `t_display_position`
								LEFT JOIN `t_displays` ON(`t_displays`.`id` = `t_display_position`.`display_id`)
								WHERE `t_display_position`.`old_system` = 0 AND `t_displays`.`id`  IS NOT NULL AND `t_displays`.`old_system` = 0';
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute();
		$displays = array();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public static function getAllByProductTreeId($productTreeId){
		$query = '	SELECT `t_display_position`.*, `t_displays`.`base_display_template_id`, `t_displays`.`id`  AS displayID
								FROM `t_display_position`
								LEFT JOIN `t_displays` ON(`t_displays`.`id` = `t_display_position`.`display_id`)
								WHERE `t_display_position`.`old_system` = 0
								AND `t_displays`.`id`  IS NOT NULL
								AND `t_displays`.`old_system` = 0
								AND `t_display_position`.`product_tree` = ?';
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute(array($productTreeId));
		$displays = array();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public static function getAllWithArticlesAndProductPath(){
		$products = self::getAll();

		foreach( $products as $index => $product ){
			$products[$index]['path'] = self::getProductPath($product['product_tree']);
			$products[$index]['article'] = self::getArticles($product['id']);
			$products[$index]['display_parts'] = cDisplaysPartsModel::getPartsToDisplayByDisplayId($product['display_id']);
			$products[$index]['promotion_material'] = cTopSignModel::getByProductId($product['id']);
		}
		return $products;
	}

	private static function getProductPath($id){
		if(! isset(self::$productPaths[$id])){
			$query = "SELECT
							id,
							GROUP_CONCAT(name ORDER BY rownum DESC SEPARATOR '->') AS path,
							GROUP_CONCAT(pathid ORDER BY rownum DESC SEPARATOR '->') AS pathbyid
							FROM
							(
									SELECT
																	@rownum := @rownum+1 AS rownum,

																	IF(@lastid <> mylist.id, @id := mylist.id, @id) AS pathid,
																	(SELECT name FROM t_product_tree  WHERE id = @id) AS name,
																	@lastid := mylist.id AS id,
																	@id := (SELECT parent FROM t_product_tree  WHERE id = @id) AS parentID
									FROM
																	(SELECT @id := 0, @lastid := 0, @rownum := 0) AS vars,
																	(SELECT id FROM t_product_tree) AS myloop,
																	(SELECT id,name FROM t_product_tree) AS mylist
							) AS t
							WHERE
									pathid IS NOT NULL AND ID = $id
							GROUP BY
									id";
			$db = cDatabase::getInstance();
			$stmt = $db->hConnection->prepare($query);
			$stmt->execute();
			$displays = array();
			self::$productPaths[$id] = $stmt->fetch(PDO::FETCH_ASSOC);
		}
		return self::$productPaths[$id];
	}

	private static function getArticles($position_id){
			$query = "SELECT * FROM `r_display-article` L1 JOIN `t_articles` R1 ON L1.article_id = R1.id WHERE L1.position = $position_id";
			$db = cDatabase::getInstance();
			$stmt = $db->hConnection->prepare($query);
			$stmt->execute();
			$displays = array();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
