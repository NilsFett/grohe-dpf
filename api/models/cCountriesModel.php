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
class cCountriesModel extends cModel{

	protected $aColumns = array(
		'id' => array(
			'value' => false,
			'type' => 'int'
		),
		'Code' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'Name' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'Continent' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'Region' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'hide' => array(
			'value' => false,
			'type' => 'varchar'
		)
	);
	static $sTable = 't_country';
	protected $sPrimary = 'id';

	public function __construct($aData = false){
		parent::__construct($aData);
	}

	public static function getAll(){
		$query = '	SELECT *
					FROM `t_country`';
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public static function getAllSortByContinent(){
		$query = '	SELECT *
					FROM `t_country`
					WHERE hide = "true"
					ORDER BY Continent, Name';
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute();
		$allSortByContinent = array();
		$continentCounter = -1;
		$continents = array();
		while( $row = $stmt->fetch(PDO::FETCH_ASSOC) ){
			if( ! isset ($continents[$row['Continent']]) ){
				$continents[$row['Continent']] = $row['Continent'];
				$continentCounter++;
				$allSortByContinent[$continentCounter] = array();

			}
			$allSortByContinent[$continentCounter][] = $row;
		}
		return $allSortByContinent;
	}
}
