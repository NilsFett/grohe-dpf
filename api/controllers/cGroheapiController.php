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

	public function getProducts(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$articles = cProductsModel::getAll();
			echo json_encode($articles);
		}
	}


	public function getUsers(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$users = cUserModel::getAll();
			echo json_encode($users);
		}
	}

	public function loadImages(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$images = cImageModel::getAll();
			echo json_encode($images);
		}
	}


	public function getUserRequests(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$users = cUserModel::getUserRequests();
			echo json_encode($users);
		}
	}

	public function productTree(){
		if( cSessionUser::getInstance()->bIsLoggedIn){
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


	public function changeProduct(){
		$postData = json_decode(file_get_contents('php://input'),true);
		if(isset($postData['id'])){
			$oDisplaysPartsModel = new cProductsModel($postData['id']);
		}
		else{
			$oDisplaysPartsModel = new cProductsModel();
		}
		if(isset($postData['title'])){
			$oDisplaysPartsModel->set('title', $postData['title']);
		}
		if(isset($postData['DFID'])){
			$oDisplaysPartsModel->set('DFID', $postData['DFID']);
		}
		if(isset($postData['empty_display'])){
			$oDisplaysPartsModel->set('empty_display', $postData['empty_display']);
		}
		else{
			$oDisplaysPartsModel->set('empty_display', 0);
		}
		if(isset($postData['display_id'])){
			$oDisplaysPartsModel->set('display_id', $postData['display_id']);
		}
		if(isset($postData['SAP'])){
			$oDisplaysPartsModel->set('SAP', $postData['SAP']);
		}
		if(isset($postData['product_tree'])){
			$oDisplaysPartsModel->set('product_tree', $postData['product_tree']);
		}
		if(isset($postData['price'])){
			$oDisplaysPartsModel->set('price', $postData['price']);
		}
		if(isset($postData['pallet_select'])){
			$oDisplaysPartsModel->set('pallet_select', $postData['pallet_select']);
		}
		else{
			$oDisplaysPartsModel->set('pallet_select', 0);
		}
		if(isset($postData['pallet_disabled'])){
			$oDisplaysPartsModel->set('pallet_disabled', $postData['pallet_disabled']);
		}
		else{
			$oDisplaysPartsModel->set('pallet_disabled', 0);
		}
		if(isset($postData['topsign_upload_disabled'])){
			$oDisplaysPartsModel->set('topsign_upload_disabled', $postData['topsign_upload_disabled']);
		}
		else{
			$oDisplaysPartsModel->set('topsign_upload_disabled', 0);
		}
		if(isset($postData['notopsign_order_disabled'])){
			$oDisplaysPartsModel->set('notopsign_order_disabled', $postData['notopsign_order_disabled']);
		}
		else{
			$oDisplaysPartsModel->set('notopsign_order_disabled', 0);
		}
		if(isset($postData['deliverytime'])){
			$oDisplaysPartsModel->set('deliverytime', $postData['deliverytime']);
		}
		if(isset($postData['image'])){
			$oDisplaysPartsModel->set('image', $postData['image']);
		}
		if(isset($postData['image_thumb'])){
			$oDisplaysPartsModel->set('image_thumb', $postData['image_thumb']);
		}
		if(isset($postData['hide'])){
			$oDisplaysPartsModel->set('hide', $postData['hide']);
		}
		else{
			$oDisplaysPartsModel->set('hide', 0);
		}

		$oDisplaysPartsModel->save();
		$this->getProducts();
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

	public function deleteDisplay(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$postData = json_decode(file_get_contents('php://input'),true);
			$oDisplayModel = new cDisplaysModel($postData['id']);
			$oDisplayModel->delete();
			$this->getDisplays();
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

	public function deleteProduct(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$postData = json_decode(file_get_contents('php://input'),true);
			$oArticlesModel = new cProductsModel($postData['id']);
			$oArticlesModel->delete();
			$this->getProducts();
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
		if( isset ($postData['display']['id']) ){
			$oDisplay = new cDisplaysModel($postData['display']['id']);
			cRDisplayPartModel::deleteByDisplayId($postData['display']['id']);
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
		foreach( $postData['partsList'] as $part ){
			cRDisplayPartModel::replace($oDisplay->get('id'), $part['id'], $part['units']);
		}

		$this->getDisplays();
	}

	public function uploadImage(){

		if( count($_FILES) ){
			foreach( $_FILES as $aImage ){
				$aSize = getimagesize($aImage['tmp_name']);

				if($aImage['type'] == 'application/octet-stream'){
					if($aSize !== false){
						$aFile['type'] = $aSize['mime'];
					}
				}
				if($aImage['error'][0] == 0 && ( $aImage['type'] == 'image/jpeg' || $aImage['type'] == 'image/gif' || $aImage['type'] == 'image/png' || $aImage['type'] == 'application/pdf' )){

				}
				else if( $aImage['error'] == 0 ){
					$aErrors [] = 'File '.$aImage['tmp_name'].' konnte hochgeladen werden.';
					continue;
				}

				$sExtension = explode('/', $aSize['mime']);
				$sExtension = $sExtension[1];
				$sHash = sha1(file_get_contents($aImage['tmp_name']));

				if(cImageModel::imageExists($sHash, 1)){
					$aErrors[] = 'File '.$aImage['name'].' existiert bereits in diesem Ordner.';
				}
				else{
					if(move_uploaded_file($aImage['tmp_name'], cConfig::getInstance()->get('basepath').'uploads/'.$sHash.'.'.$sExtension)) {
						$oImage = new cImageModel();
						$oImage->set('title', $aImage['name']);
						$oImage->set('path', $sHash);



						if( $aImage['type'] == 'image/jpeg' || $aImage['type'] == 'image/gif' || $aImage['type'] == 'image/png' ){
							/*
							if(isset($aSize[0])){
								$oResource->set('width', $aSize[0]);
							}
							if(isset($aSize[1])){
								$oResource->set('height', $aSize[1]);
							}
							*/
							if($aSize[0] > $aSize[1]){
								$newHeight = $aSize[1] / ( $aSize[0] / 100 );
								$newWidth = 100;
							}
							elseif($aSize[0] < $aSize[1]){
								$newHeight = 100;
								$newWidth = $aSize[0] / ( $aSize[1] / 100 );
							}
							else{
								$newHeight = 100;
								$newWidth = 100;
							}

							$image = new Imagick(cConfig::getInstance()->get('basepath')."uploads/".$sHash.".".$sExtension);

							$image->resizeImage($newWidth, $newHeight, imagick::FILTER_CUBIC, 1, true);
							//$image->cropThumbnailImage($newWidth,$newHeight);
							$image->writeImage( cConfig::getInstance()->get('basepath')."uploads/thumbs/".$sHash.".".$sExtension );
						}
						$oImage->save();
						echo json_encode(array('success'=>true));
					}
					else{
						$aErrors[] = 'File '.$aImage['name'].' konnte nicht hochgeladen werden.';
						echo json_encode(array('success'=>false,'errors'=>$aErrors));
					}
				}
			}
		}
	}

}
