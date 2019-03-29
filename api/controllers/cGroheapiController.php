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
class cGroheapiController{
	static $oInstance = NULL;
	private $aActionStatus = array();

	private $newlyCreatedComponentsDuringExecuteChangeStackByTempId;
	private $changingComponentsDuringExecuteChangeStackByTempId;

	private function __construct(){

	}

	static public function getInstance(){
		if(self::$oInstance == NULL){
			self::$oInstance = new cGroheapiController();
		}
		return self::$oInstance;
	}



	public function index(){
		echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'data'=>cSessionUser::getInstance()->data()));
	}

	public function isLoggedIn(){
		echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'data'=>cSessionUser::getInstance()->data()));
	}

	public function login(){
		$postData = json_decode(file_get_contents('php://input'),true);
		$oSessionUser = cSessionUser::getInstance();
		$oSessionUser->login($postData['email'], $postData['passwd']);
		echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'data'=>cSessionUser::getInstance()->data()));
	}

	public function logout(){
		$postData = json_decode(file_get_contents('php://input'),true);
		$oSessionUser = cSessionUser::getInstance();
		$oSessionUser->logout();
		echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'data'=>cSessionUser::getInstance()->data()));
	}

	public function register(){
		$postData = json_decode(file_get_contents('php://input'),true);
/*
		$postData['city'] = "Iserlohn";
		$postData['costcentre'] = "23423423";
		$postData['costcentrecountry'] = "DEU";
		$postData['country'] = "Germany";
		$postData['department'] = "Development";
		$postData['fax'] = "";
		$postData['mail'] = "nils.fett@gmail.com";
		$postData['name'] = "Nils";
		$postData['name'] = "Fett";

		$postData['phone'] = "023719309399";
		$postData['street'] = "Am großen Teich 20";
		$postData['zipcode'] = "58640";
*/
		$postData['usertype'] = 'user';
		$postData['createdate'] = date( 'Y-m-d H:m:i', time());


		$user = cUserModel::register($postData);
		if($user){
			$oCostNo = new cCostNoModel();
			$oCostNo->set('userid', $user->get('id'));
			$oCostNo->set('costno', $postData['costcentre']);
			$oCostNo->set('description', $postData['costcentrecountry']);
			$oCostNo->save();
			cMail::sentMail('new_registration', array('user' => $user, 'costno' => $oCostNo));
			echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'success' => true));
		}
		else{
			echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'success' => false, 'error' => 'E-Mail Address exists'));
		}
	}

	public function passwordReset(){
		$postData = json_decode(file_get_contents('php://input'),true);
		$ocUserModel = cUserModel::loadByEmail($postData['email']);
		if($ocUserModel){
			$password = GeneratePassword();
			$ocUserModel->set('password', md5($password));

			$ocUserModel->save();
			cMail::sentMail('password_reset', array('user' => $ocUserModel, 'password' => $password));
			echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'success' => true));
		}
		else{
			echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'success' => false, 'error' => 'E-Mail Address not found'));
		}
	}

	public function getCountries(){
		$countries = cCountriesModel::getAllSortByContinent();
		echo json_encode($countries);
	}

	public function getDisplays(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$displays = cDisplaysModel::getAll();
			echo json_encode($displays);
		}
	}

	public function getDisplaysParts(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$displays = cDisplaysPartsModel::getPartsToDisplays();
			echo json_encode($displays);
		}
	}

	public function getDisplayParts(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$displays = cDisplaysPartsModel::getAll();
			echo json_encode($displays);
		}
	}

	public function getArticles(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$articles = cArticlesModel::getAll();
			echo json_encode($articles);
		}
	}

	public function getUsers(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$users = cUserModel::getAll();
			echo json_encode($users);
		}
	}

	public function getUserRequests(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$users = cUserModel::getUserRequests();
			echo json_encode($users);
		}
	}

	public function productTree(){
		if(true || cSessionUser::getInstance()->bIsLoggedIn){
			$users = cProductTreeModel::getAll();
			echo json_encode($users);
		}
	}


	public function acceptUserRequest(){
		$postData = json_decode(file_get_contents('php://input'),true);

		if(cSessionUser::getInstance()->bIsLoggedIn){
			$ocUserModel = new cUserModel($postData['id']);
			$ocUserModel->set('usertype', $postData['usertype']);
			$ocUserModel->set('verifyBy', cSessionUser::getInstance()->get('id'));
			$ocUserModel->set('verifyAt', date('Y-m-d H:m:i'), time());
			$password = GeneratePassword();
			$ocUserModel->set('password', md5($password));
			$ocUserModel->save();
			cMail::sentMail('account_released', array('user' => $ocUserModel, 'password' => $password));

			$this->getUserRequests();
		}
	}

	public function declineUserRequest(){
		$postData = json_decode(file_get_contents('php://input'),true);
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$ocUserModel = new cUserModel($postData['id']);
			$ocUserModel->set('deleted', 1);
			$ocUserModel->save();
			echo json_encode($ocUserModel);
		}
	}

	public function changeDisplayPart(){
		$postData = json_decode(file_get_contents('php://input'),true);
		if(isset($postData['id'])){
			$oDisplaysPartsModel = new cDisplaysPartsModel($postData['id']);
		}
		else{
			$oDisplaysPartsModel = new cDisplaysPartsModel();
		}
		if(isset($postData['title'])){
			$oDisplaysPartsModel->set('title', $postData['title']);
		}
		if(isset($postData['articlenr'])){
			$oDisplaysPartsModel->set('articlenr', $postData['articlenr']);
		}
		if(isset($postData['open_format'])){
			$oDisplaysPartsModel->set('open_format', $postData['open_format']);
		}
		if(isset($postData['stock'])){
			$oDisplaysPartsModel->set('stock', $postData['stock']);
		}
		if(isset($postData['weight'])){
			$oDisplaysPartsModel->set('weight', $postData['weight']);
		}
		if(isset($postData['deleted'])){
			$oDisplaysPartsModel->set('deleted', $postData['deleted']);
		}
		else{
			$oDisplaysPartsModel->set('deleted', 0);
		}

		$oDisplaysPartsModel->save();
		$this->getDisplayParts();
	}

	public function changeArticle(){
		$postData = json_decode(file_get_contents('php://input'),true);


		if(isset($postData['id'])){
			$oArticlesModel = new cArticlesModel($postData['id']);
		}
		else{
			$oArticlesModel = new cArticlesModel();
		}
		if(isset($postData['articlenr'])){
			$oArticlesModel->set('articlenr', $postData['articlenr']);
		}
		if(isset($postData['title'])){
			$oArticlesModel->set('title', $postData['title']);
		}
		if(isset($postData['extra'])){
			$oArticlesModel->set('extra', $postData['extra']);
		}
		if(isset($postData['type'])){
			$oArticlesModel->set('type', $postData['type']);
		}
		if(isset($postData['packaging'])){
			$oArticlesModel->set('packaging', $postData['packaging']);
		}
		if(isset($postData['weight'])){
			$oArticlesModel->set('weight', $postData['weight']);
		}
		if(isset($postData['topsign'])){
			$oArticlesModel->set('topsign', $postData['topsign']);
		}
		if(isset($postData['deleted'])){
			$oArticlesModel->set('deleted', $postData['deleted']);
		}
		else{
			$oArticlesModel->set('deleted', 0);
		}
		$oArticlesModel->save();
		$this->getArticles();
	}

	public function changeUser(){
		$postData = json_decode(file_get_contents('php://input'),true);


		if(isset($postData['id'])){
			$oArticlesModel = new cUserModel($postData['id']);
		}
		else{
			$oArticlesModel = new cUserModel();
		}
		if(isset($postData['name'])){
			$oArticlesModel->set('name', $postData['name']);
		}
		if(isset($postData['surname'])){
			$oArticlesModel->set('surname', $postData['surname']);
		}
		if(isset($postData['department'])){
			$oArticlesModel->set('department', $postData['department']);
		}
		if(isset($postData['street'])){
			$oArticlesModel->set('street', $postData['street']);
		}
		if(isset($postData['zipcode'])){
			$oArticlesModel->set('zipcode', $postData['zipcode']);
		}
		if(isset($postData['city'])){
			$oArticlesModel->set('city', $postData['city']);
		}
		if(isset($postData['country'])){
			$oArticlesModel->set('country', $postData['country']);
		}
		if(isset($postData['phone'])){
			$oArticlesModel->set('phone', $postData['phone']);
		}
		if(isset($postData['fax'])){
			$oArticlesModel->set('fax', $postData['fax']);
		}
		if(isset($postData['mail'])){
			$oArticlesModel->set('mail', $postData['mail']);
		}
		if(isset($postData['usertype'])){
			$oArticlesModel->set('usertype', $postData['usertype']);
		}
		if(isset($postData['deleted'])){
			$oArticlesModel->set('deleted', $postData['deleted']);
		}
		else{
			$oArticlesModel->set('deleted', 0);
		}
		$oArticlesModel->save();
		$this->getArticles();
	}

	public function deleteDisplayPart(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$postData = json_decode(file_get_contents('php://input'),true);
			$oDisplaysPartsModel = new cDisplaysPartsModel($postData['id']);
			$oDisplaysPartsModel->delete();
			$this->getDisplayParts();
		}
	}

	public function deleteArticle(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$postData = json_decode(file_get_contents('php://input'),true);
			$oArticlesModel = new cArticlesModel($postData['id']);
			$oArticlesModel->delete();
			$this->getArticles();
		}

	}

	public function loadDisplasPartsByDisplayId(){
		if(cSessionUser::getInstance()->bIsLoggedIn && isset($_GET['display_id']) && is_numeric($_GET['display_id'])){
			$displays = cDisplaysPartsModel::getByDisplayId((int)$_GET['display_id']);
			echo json_encode($displays);
		}
	}

	public function saveDisplayAndPartList(){
		$postData = json_decode(file_get_contents('php://input'),true);



		$postData = array(
	  	"display"=> array(
	    	"title"=>"Super Display",
	    	"articlenr"=>"154680011",
	    	"image"=>3,
	    	"hide"=>false,
	    	"displaytype"=>"1_4_chep_pallet",
	    	"topsign_punch"=>"",
	    	"instruction"=>3
	  ),
	  "partsList"=>array(
	    array(
				"id"=>98001210,
	      "title"=>"Dekopunkt Durchmesser 30 mm",
	      "articlenr"=>98001210,
	      "open_format"=>"30 x 30",
	      "stock"=>2147475999,
	      "weight"=>1,
	      "deleted"=>0,
	      "units"=>2
	    ),
	    array(
	      "id"=>98001240,
	      "title"=> "Stülper groß - Halbfaltkiste mit zusammen stoßende",
	      "articlenr"=>98001240,
	      "open_format"=>"1375 x 2009",
	      "stock"=>2147473740,
	      "weight"=>1783,
	      "deleted"=>0,
	      "units"=>1
	    ),
	    array(
	      "id"=>98001295,
	      "title"=>"Mantel gestanzt, 2-tlg. geklebt",
	      "articlenr"=>98001295,
	      "open_format"=>"1012 x 1395,5",
	      "stock"=>2147483437,
	      "weight"=>700,
	      "deleted"=>0,
	      "units"=>1
	    ),
	    array(
	      "id"=>98001202,
	      "title"=>"Sockel gestanzt, aus 2 gleichen Teilen zusammen ge",
	      "articlenr"=>"98001202",
	      "open_format"=>"562 x 1001",
	      "stock"=>2147474272,
	      "weight"=>"270",
	      "deleted"=>0,
	      "units"=>1
	    )
		  )
		);
		echo '<pre>';
		var_dump($postData);

		if( isset ($postData['display'][id]) ){
			$oDisplay = new cDisplaysModel($postData['display']['id']);
			cDisplaysPartsModel::deleteByDisplayId($postData['display']['id']);
		}
		else{
			$oDisplay = new cDisplaysModel();
		}
		$oDisplay->set('title', $postData['display']['title']);
		$oDisplay->set('articlenr', $postData['display']['articlenr']);
		$oDisplay->set('image', $postData['display']['image']);
		$oDisplay->set('displaytype', $postData['display']['displaytype']);
		$oDisplay->set('topsign_punch', $postData['display']['topsign_punch']);
		$oDisplay->set('instruction', $postData['display']['instruction']);
		$oDisplay->set('hide', 0);
		if( isset($postData['display']['hide']) && $postData['display']['hide'] ){
			$oDisplay->set('hide', 1);
		}
		$oDisplay->save();
		foreach( $postData['display']['partsList'] as $part ){
			$oDisplaysPartsModel = new cDisplaysPartsModel();
			$oDisplaysPartsModel
		}

	}
}
