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
class cOrderModel extends cModel{

	protected $aColumns = array(
		'id' => array(
			'value' => false,
			'type' => 'int'
		),
		'date' => array(
			'value' => false,
			'type' => 'datetime'
		),
		'userid' => array(
			'value' => false,
			'type' => 'int'
		),
		'costcentre' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'costcentrecode' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'promotion_title' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'SAP' => array(
			'value' => false,
			'type' => 'int'
		),
		'display_quantity' => array(
			'value' => false,
			'type' => 'int'
		),
		'pallet_quantity' => array(
			'value' => false,
			'type' => 'int'
		),
		'status' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'delivery' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'bypacks' => array(
				'value' => false,
				'type' => 'varchar'
			),
		'product' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'topsign' => array(
			'value' => false,
			'type' => 'int'
		),
		'topsign_own' => array(
			'value' => false,
			'type' => 'int'
		),
		'checklist' => array(
			'value' => false,
			'type' => 'int'
		),
		'desired_date_delivery' => array(
			'value' => false,
			'type' => 'datetime'
		),
		'old_system' => array(
			'value' => false,
			'type' => 'int'
		)
	);
	static $sTable = 't_order';
	protected $sPrimary = 'id';

	public function __construct($aData = false){
		parent::__construct($aData);
	}

	public static function getCurrent(){
		$query = '	SELECT *
					FROM `'.self::$sTable.'`
					WHERE `old_system` = 0
					AND `status` = "progress"
					AND userid = ?';
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute(array(cSessionUser::getInstance()->get('id')));

		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		if($row){
			return new cOrderModel($row);
		}
		else{
			$order = new cOrderModel();
			$order->set('userid', cSessionUser::getInstance()->get('id'));
			$order->set('status', 'progress');
			$order->set('date', date('Y-m-d H:i:s'));
			$order->save();
		}
		return $order;
	}


	public static function getByProductId($productId){
		$query = '	SELECT `t_articles`.*, `r_display-article`.`units`
								FROM `t_articles`
								JOIN `r_display-article` ON `r_display-article`.`article_id` = `t_articles`.`id`
								JOIN `t_display_position` ON `r_display-article`.`position` = `t_display_position`.`id`
								WHERE `t_display_position`.`id` = '.$productId.'
								ORDER BY `t_articles`.articlenr ';
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
