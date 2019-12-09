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

		if($oSessionUser->get('id')){
			$oSessionUser->logout();
		}

		echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'data'=>cSessionUser::getInstance()->data()));
	}

	public function register(){
		$postData = json_decode(file_get_contents('php://input'),true);
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

	public function saveUserData(){
		$postData = json_decode(file_get_contents('php://input'),true);
		$user = new cUserModel($postData['id']);


		if($user->get('id')){
            $user->set('surname', $postData['surname']);
            $user->set('name', $postData['name']);
            $user->set('department', $postData['department']);
            $user->set('street', $postData['street']);
            $user->set('zipcode', $postData['zipcode']);
            $user->set('city', $postData['city']);
            $user->set('country', $postData['country']);
            $user->set('phone', $postData['phone']);
            $user->set('fax', $postData['fax']);
            $user->set('mail', $postData['mail']);

            $user->save();
            $oCostNo = cCostNoModel::getByUserId($user->get('id'));

			$oCostNo->set('costno', $postData['costcentre']);
			$oCostNo->set('description', $postData['costcentrecountry']);
			$oCostNo->save();

			echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'success' => true));
		}
		else{
			echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'success' => false, 'error' => 'Errors'));
		}
	}


    public function changePassword(){
        $postData = json_decode(file_get_contents('php://input'),true);
        $user = new cUserModel($postData['id']);

        if($user->get('id')){
            $user->set('password', md5($postData['password']));
            $user->save();

            echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'success' => true));
        }
        else{
            echo json_encode(array('loggedIn'=>cSessionUser::getInstance()->bIsLoggedIn,'success' => false, 'error' => 'Errors'));
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

	public function loadTopSigns(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$articles = cTopSignModel::getAll();
			echo json_encode($articles);
		}
	}

	public function loadPromotionImages(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$articles = cPromotionImagesModel::getAll();
			echo json_encode($articles);
		}
	}

	public function deletePromotionImages(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$postData = json_decode(file_get_contents('php://input'),true);
			$oPromotionImagesModel = new cPromotionImagesModel($postData['id']);
			$oPromotionImagesModel->delete();
			$this->loadPromotionImages();
		}
	}

	public function getProducts(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			if(! isset($_GET['id']) || !  $_GET['id'] ){
				$products = cProductsModel::getAll();
			}
			else{
				$products = cProductsModel::getAllByProductTreeId($_GET['id']);
			}
			echo json_encode($products);
		}
	}

	public function getAllProductsWithArticlesAndProductPath(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$products = cProductsModel::getAllWithArticlesAndProductPath();
			echo json_encode($products);
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

	public function loadCategories(){
		if( cSessionUser::getInstance()->bIsLoggedIn){
			$tree = cProductTreeModel::getAllAsTree();
			echo json_encode($tree);
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



	public function changePromotionImage(){
		$postData = json_decode(file_get_contents('php://input'),true);
		if(isset($postData['id'])){
			$oPromotionImagesModel = new cPromotionImagesModel($postData['id']);
		}
		else{
			$oPromotionImagesModel = new cPromotionImagesModel();
		}
		if(isset($postData['name'])){
			$oPromotionImagesModel->set('name', $postData['name']);
		}
		if(isset($postData['image_id'])){
			$oPromotionImagesModel->set('image_id', $postData['image_id']);
		}
		if(isset($postData['active'])){
			$oPromotionImagesModel->set('active', $postData['active']);
		}
		$oPromotionImagesModel->save();
		$this->loadPromotionImages();
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
		if(isset($postData['length'])){
			$oDisplaysPartsModel->set('length', $postData['length']);
		}
		if(isset($postData['width'])){
			$oDisplaysPartsModel->set('width', $postData['width']);
		}
		if(isset($postData['height'])){
			$oDisplaysPartsModel->set('height', $postData['height']);
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
		if(isset($postData['height'])){
			$oArticlesModel->set('height', $postData['height']);
		}
		if(isset($postData['width'])){
			$oArticlesModel->set('width', $postData['width']);
		}
		if(isset($postData['depth'])){
			$oArticlesModel->set('depth', $postData['depth']);
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
		if(isset($postData['costno'])){
			cCostNoModel::replaceCostno($oArticlesModel->get('id'),$postData['costno'],$postData['description']);
		}
		$oArticlesModel->save();
		$this->getUsers();
	}


	public function changeTopSign(){
		$postData = json_decode(file_get_contents('php://input'),true);


		if(isset($postData['id'])){
			$oArticlesModel = new cTopSignModel($postData['id']);
		}
		else{
			$oArticlesModel = new cTopSignModel();
		}
		if(isset($postData['articlenr'])){
			$oArticlesModel->set('articlenr', $postData['articlenr']);
		}
		if(isset($postData['type'])){
			$oArticlesModel->set('type', $postData['type']);
		}
		if(isset($postData['title'])){
			$oArticlesModel->set('title', $postData['title']);
		}
		if(isset($postData['path'])){
			$oArticlesModel->set('path', $postData['path']);
		}
		if(isset($postData['image'])){
			$oArticlesModel->set('image', $postData['image']);
		}
		if(isset($postData['image_thumb'])){
			$oArticlesModel->set('image_thumb', $postData['image_thumb']);
		}
		if(isset($postData['weight'])){
			$oArticlesModel->set('weight', $postData['weight']);
		}


		$oArticlesModel->save();
		$this->loadTopSigns();
	}

	public function deleteUser(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$postData = json_decode(file_get_contents('php://input'),true);
			$oDisplaysPartsModel = new cUserModel($postData['id']);
			$oDisplaysPartsModel->delete();
			$this->getUsers();
		}
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

	public function deleteImage(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			$postData = json_decode(file_get_contents('php://input'),true);
			$oImageModel = new cImageModel($postData['id']);
			$oImageModel->delete();
			$this->loadImages();
		}
	}

	public function loadDisplasPartsByDisplayId(){
		if(cSessionUser::getInstance()->bIsLoggedIn && isset($_GET['display_id']) && is_numeric($_GET['display_id'])){
			$displays = cDisplaysPartsModel::getByDisplayId((int)$_GET['display_id']);
			echo json_encode($displays);
		}
	}

	public function loadArticlesByProductId(){
		if(cSessionUser::getInstance()->bIsLoggedIn && isset($_GET['article_id']) && is_numeric($_GET['article_id'])){
			$articles = cArticlesModel::getByProductId((int)$_GET['article_id']);
			$topsigns = cTopSignModel::getByProductId((int)$_GET['article_id']);
			echo json_encode(array( 'articles' => $articles, 'topsigns' => $topsigns));
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
		$oDisplay->set('base_display_template_id', $postData['display']['base_display_template_id']);
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

	public function saveProductAndArticleList(){
		$postData = json_decode(file_get_contents('php://input'),true);
		if( isset ($postData['product']['id']) ){
			$oProduct = new cProductsModel($postData['product']['id']);
			cRProductArticleModel::deleteByProductId($postData['product']['id']);
			cRProductPMModel::deleteByProductId($postData['product']['id']);
		}
		else{
			$oProduct = new cProductsModel();
		}
		$oProduct->set('title', $postData['product']['title']);
		$oProduct->set('DFID', $postData['product']['DFID']);
		if(isset($postData['product']['image'])){
			$oProduct->set('image', $postData['product']['image']);
		}

		$oProduct->set('SAP', $postData['product']['SAP']);
		$oProduct->set('supplier', $postData['product']['supplier']);
		$oProduct->set('price', $postData['product']['price']);
		if(isset($postData['product']['topsign_id'])){
			$oProduct->set('topsign_id', $postData['product']['topsign_id']);
		}
		if(isset($postData['product']['promotion_material_id'])){
			$oProduct->set('promotion_material_id', $postData['product']['promotion_material_id']);
		}
		/*
		$oProduct->set('pallet_disabled', (int)$postData['product']['pallet_disabled']);
		$oProduct->set('pallet_select', (int)$postData['product']['pallet_select']);
		$oProduct->set('bypack_disabled', (int)$postData['product']['bypack_disabled']);
		$oProduct->set('topsign_upload_disabled', (int)$postData['product']['topsign_upload_disabled']);
		$oProduct->set('notopsign_order_disabled', (int)$postData['product']['notopsign_order_disabled']);
		$oProduct->set('empty_display', (int)$postData['product']['empty_display']);
		*/
		$oProduct->set('deliverytime', (int)$postData['product']['deliverytime']);

		$oProduct->set('product_tree', (int)$postData['product']['product_tree']);
		if(isset($postData['product']['display_id'])){
			$oProduct->set('display_id', $postData['product']['display_id']);
		}
		else{
			$oProduct->set('display_id', 1);
		}

		$oProduct->save();
		foreach( $postData['articleList'] as $article ){
			cRProductArticleModel::replace($oProduct->get('id'), $article['id'], $article['units']);
		}
		foreach( $postData['promotionMaterial'] as $pm ){
			cRProductPMModel::replace($oProduct->get('id'), $pm['id'], $pm['units']);
		}
		$this->getProducts();
	}

	public function finishOrder(){
		$postData = json_decode(file_get_contents('php://input'),true);
		$order = cOrderModel::getCurrent();
		$order->set('status', 'ordered');
		$order->save();
		$oTopSignModel = new cTopSignModel($postData['product']['topsign_id']);
		$displayPartsWeight = 0;
		foreach ($postData['product']['display_parts']	as $part) {
			$displayPartsWeight += $postData['quantity'] * $part['weight'] * $part['units'];
		}
		$articlesWeight = 0;
		foreach ($postData['product']['article']	as $article) {
			$articlesWeight += $postData['quantity'] * $article['weight'] * $article['units'];
		}
		$userCostno = cCostNoModel::getByUserId(cSessionUser::getInstance()->get('id'));
		cMail::sentMail('new_order', array(
			'user' => cSessionUser::getInstance(),
			'order' => $order,
			'product' => $postData,
			'costno' => $userCostno,
			'displayPartsWeight' => $displayPartsWeight,
			'articlesWeight' => $articlesWeight,
			'topsign' => $oTopSignModel,
			'SAP'=> $postData['sap']));
		//cMail::sentMail('order_success', array('user' => cSessionUser::getInstance(), 'order' => $order));


		echo json_encode(array('success'=>true));
	}

	public function storeOrder(){
		$postData = json_decode(file_get_contents('php://input'),true);

		$postData['product']['display_type'] = $postData['product']['path']['path'];
		unset($postData['product']['path']);
		$displayPartsWeight = 0;

		foreach ($postData['product']['display_parts']	as $part) {
			$displayPartsWeight += $part['weight'] * $part['units'];
		}
		$articlesWeight = 0;
		foreach ($postData['product']['article']	as $article) {
			$articlesWeight += $article['weight'] * $article['units'];
			//if(empty($DT))$DT = $article['DT'];
		}


		$order = cOrderModel::getCurrent();

		$order->set('date', date('Y-m-d H:i:s'));
		if(empty($postData['desired_date_delivery'])){
			$order->set('desired_date_delivery', date('Y-m-d H:i:s', time(60*60*24*35)));
		}
		else{
			$order->set('desired_date_delivery', $postData['desired_date_delivery']);
		}

		$order->set('costcentre', $postData['costcentre']);//obsolet
		$order->set('customer', $postData['customer']);//obsolet
		$userCostno = cCostNoModel::getByUserId(cSessionUser::getInstance()->get('id'));
		$order->set('costcentrecode', $postData['costcentre_description']);
		$order->set('costcentre_costno', $postData['costcentre_costno']);
		$order->set('promotion_title', $postData['pit']);
		$order->set('SAP', $postData['sap']);
		$order->set('channel', $postData['channel']);
		$order->set('display_quantity', $postData['quantity']);
		$order->set('pallet_quantity', $postData['quantity']);
		$order->set('status', 'progress');
		$order->set('product', serialize($postData['product']));

		$oTopSignModel = new cTopSignModel($postData['product']['topsign_id']);

		$order->set('topsign', serialize($oTopSignModel->getValuesArray()));
		$desired_date_delivery = date('Y-m-d H:i:s',strtotime($postData['desired_date_delivery']));

		$order->set('desired_date_delivery', $desired_date_delivery);
		$order->save();

		echo json_encode(array('success'=>true));
  }

	public function uploadImage(){

		putenv('PATH=/usr/local/bin:/usr/bin:/bin:/opt/local/bin/');
		if( count($_FILES) ){
			foreach( $_FILES as $aImage ){
				$aSize = getimagesize($aImage['tmp_name']);

				if($aImage['type'] == 'application/octet-stream'){
					if($aSize !== false){
						$aImage['type'] = $aSize['mime'];
					}
				}
				if($aImage['error'][0] == 0 && ( $aImage['type'] == 'image/jpeg' || $aImage['type'] == 'image/gif' || $aImage['type'] == 'image/png' || $aImage['type'] == 'application/pdf' )){

				}
				else if( $aImage['error'] == 0 ){
					$aErrors [] = 'File '.$aImage['tmp_name'].' konnte hochgeladen werden.';
					continue;
				}
				$sExtension = explode('/', $aImage['type']);
				$sExtension = $sExtension[1];
				$sHash = sha1(file_get_contents($aImage['tmp_name']));

				if(cImageModel::imageExists($sHash, 1)){
					$aErrors[] = 'File '.$aImage['name'].' existiert bereits in diesem Ordner.';
				}
				else{
					if(move_uploaded_file($aImage['tmp_name'], cConfig::getInstance()->get('basepath').'uploads/'.$sHash.'.'.$sExtension)) {
						if ( $aImage['type'] == 'application/pdf' && $_GET['type'] == 5){
							$execute = 'convert -density 72 \'' . cConfig::getInstance()->get('basepath').'uploads/'.$sHash.'.'.$sExtension . '\'[0] -colorspace sRGB -resize 1200x600 \'' . cConfig::getInstance()->get('basepath').'uploads/'.$sHash.'.jpeg';

							$src = cConfig::getInstance()->get('basepath').'uploads/'.$sHash.'.'.$sExtension;
							$dest = cConfig::getInstance()->get('basepath').'uploads/'.$sHash.'.jpeg';

							$execute = '/usr/local/bin/convert -density 72 \'' . $src. '[0]\' -colorspace sRGB -background white -alpha off -resize 1200x600 \'' . $dest .'\' 2>&1';
							$sExtension = 'jpeg';
							exec($execute,$x,$y);
						}
						$oImage = new cImageModel();
						$oImage->set('title', $aImage['name']);
						$oImage->set('path', $sHash.'.'.$sExtension);

						$type = 1;
						if($_GET['type'] == 'pimages'){
							$type = 2;
						}
						elseif($_GET['type'] == 'tsimages'){
							$type = 3;
						}
						elseif($_GET['type'] == 'tspdf'){
							$type = 4;
						}
						elseif($_GET['type'] == 5){
							$type = 5;
						}
						$oImage->set('type', $type);



						if( $aImage['type'] == 'image/jpeg' || $aImage['type'] == 'image/gif' || $aImage['type'] == 'image/png' || $aImage['type'] == 'application/pdf'  ){
							/*
							if(isset($aSize[0])){
								$oResource->set('width', $aSize[0]);
							}
							if(isset($aSize[1])){
								$oResource->set('height', $aSize[1]);
							}
							*/
							if($aSize[0] > $aSize[1]){
								$newHeight = $aSize[1] / ( $aSize[0] / 150 );
								$newWidth = 150;
							}
							elseif($aSize[0] < $aSize[1]){
								$newHeight = 150;
								$newWidth = $aSize[0] / ( $aSize[1] / 150 );
							}
							else{
								$newHeight = 150;
								$newWidth = 150;
							}

							$src = cConfig::getInstance()->get('basepath')."uploads/".$sHash.".".$sExtension;
							$dest = cConfig::getInstance()->get('basepath')."uploads/thumbs/".$sHash.".".$sExtension;

							$execute = '/usr/local/bin/convert \'' . $src. '\'  -background white -resize '.$newWidth.'x'.$newHeight.' \'' . $dest .'\' 2>&1';
							exec($execute);
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

	public function uploadTopSign(){

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
					if(move_uploaded_file($aImage['tmp_name'], cConfig::getInstance()->get('basepath').'topsign/usertopsigns/'.$sHash.'.'.$sExtension)) {
						$oImage = new cImageModel();
						$oImage->set('title', $aImage['name']);
						$oImage->set('path', $sHash.'.'.$sExtension);


						$oImage->set('type', 4);


						$oImage->save();

						$order = cOrderModel::getCurrent();
						$order->set('topsign_own',$oImage->get('id'));
						$order->save();
						echo json_encode(array('success'=>true,'imagename'=>$aImage['name'],'imageid'=>$oImage->get('id')));
					}
					else{
						$aErrors[] = 'File '.$aImage['name'].' konnte nicht hochgeladen werden.';
						echo json_encode(array('success'=>false,'errors'=>$aErrors));
					}
				}
			}
		}
	}

	public function orders(){
		if(cSessionUser::getInstance()->bIsLoggedIn){
			if(cSessionUser::getInstance()->get('usertype') == 'admin' && ! isset ($_GET['my'] )){
				$from = $_GET['from'] / 1000;
				$until = $_GET['until'] / 1000 + (60*60*24);
				echo json_encode(cOrderModel::getAllOrders($from, $until));
			}
			else{
				echo json_encode(cOrderModel::getAllByUserId(cSessionUser::getInstance()->get('id')));
			}

		}
	}

	private $displayTypeExportNames = array(
		'1_4_chep_pallet' => '1/4 pallet',
		'full_pallet' => 'Full pallet',
		'bundles' => 'bundles'
	);

	public function orderExport(){
		$spreadsheet = new PhpOffice\PhpSpreadsheet\Spreadsheet();
		$sheet = $spreadsheet->getActiveSheet();

		$sheet->setCellValue('A1', 'Tracking'); // Tracking AAAAAAAAA
		$sheet->setCellValue('B1', 'cross charge'); // crosscharge BBBBBBBBBB
		$sheet->setCellValue('C1', 'out'); // crosscharge CCCCCCCCC
		$sheet->setCellValue('D1', 'MAD'); // MAD  DDDDDDDDDDD
		$sheet->setCellValue('E1', 'Supplier');// Supplier EEEEEEEEEEEEE
		$sheet->setCellValue('F1', 'order number');// Order number FFFFFFFFFFF
		$sheet->setCellValue('G1', 'Country');// Order number GGGGGGGGGGGG
		$sheet->setCellValue('H1', 'Region');// Order number GGGGGGGGGGGG
		$sheet->setCellValue('I1', 'Subregion');//Subregion IIIIIIIIIIIIIIIII
		$sheet->setCellValue('J1', 'Channel');// Channel JJJJJJJJJJJJJ
		$sheet->setCellValue('K1', 'Customer');// Customer
		$sheet->setCellValue('L1', 'Customer 2 / Promotion Title');// Customer 2 / Promotion Title
		$sheet->setCellValue('M1', 'Street');// Street
		$sheet->setCellValue('N1', 'Postal Code');// Postal Code
		$sheet->setCellValue('O1', 'City');// City
		$sheet->setCellValue('P1', 'Item/DF no.'); // DFno PPPPPPPPP
		$sheet->setCellValue('Q1', 'Display'); //Type of Display
		$sheet->setCellValue('R1', 'Type of Display'); //Type of Display
		$sheet->setCellValue('S1', 'Quantity'); // Quantity
		$sheet->setCellValue('T1', 'Planned delivery date'); // Planned delivery date
		$sheet->setCellValue('U1', 'Month'); // Month
		$sheet->setCellValue('V1', 'FY'); // Month
		$sheet->setCellValue('W1', 'Net sales'); // net sales   WWWWWWWWWWWW
		$sheet->setCellValue('X1', 'Packaging'); // Packaging
		$sheet->setCellValue('Y1', 'Filled/Empty'); // filled / empty
		$sheet->setCellValue('Z1', 'Order Date'); // Order Date
		$sheet->setCellValue('AA1', 'DF-ID'); // DF-ID
		$sheet->setCellValue('AB1', 'Cost Center'); // Cost Center
		$sheet->setCellValue('AC1', 'Topsign'); // Topsign
		$sheet->setCellValue('AD1', 'Article:'); // Article
		$sheet->setCellValue('AE1', 'Article Description'); // Article Description
		$sheet->setCellValue('AF1', 'Article Amount'); // Article Amount
		$sheet->setCellValue('AG1', 'Pallets'); // Pallets
		$sheet->setCellValue('AH1', 'Net / Net'); // Net / Net

		/*
		$sheet->setCellValue('H1', 'Market'); // Market
		$sheet->setCellValue('I1', 'SAP'); // SAP
		$sheet->setCellValue('K1', 'Promotion Title'); // Promotion title
		$sheet->setCellValue('N1', 'D/T'); // D/T
		//$sheet->setCellValue('H1', 'status');
		*/


		$articlesById = array();
		$displayPartsById = array();
		$cellCounter = 35;
		$cellCounter++;
    if(isset($_GET['from'])){
        $from = $_GET['from'] / 1000;
        $until = $_GET['until'] / 1000 + (60*60*24);
    }
    else{
        $from = false;
        $until = false;
    }

		$statusstring = '';
		if(isset($_GET['status']) && is_array($_GET['status'])){
			$statusstring = implode('","', $_GET['status'] );
		}

    $orders = cOrderModel::getAllOrders($from,$until,$statusstring);

		foreach( $orders as $order){
			if( ! isset($order['product']['article']))continue;
			foreach( $order['product']['display_parts'] as $displayPart){
				if( ! isset ( $displayPartsById[$displayPart['id']] ) ){
					$displayPartsById[$displayPart['id']] = $cellCounter;
					$cellCounter++;
				}
			}
		}

		$rowCounter = 2;
		$first = true;

		foreach( $orders as $order){

			if( ! isset($order['product']['article']))continue;
			$tracking = (empty($order['tracking']))?'':$order['tracking'];
			$sheet->setCellValueByColumnAndRow(1, $rowCounter, $tracking);
			$crosscharge = (empty($order['crosscharge']))?'':$order['crosscharge'];
			$sheet->setCellValueByColumnAndRow(2, $rowCounter, $crosscharge);
			$out = ( $order['status'] == 'finished' || $order['status'] == 'archive' )?'1':'';
			$sheet->setCellValueByColumnAndRow(3, $rowCounter, $out);
			$sheet->setCellValueByColumnAndRow(4, $rowCounter, $order['mad']);
			$supllier = (isset($order['product']['supplier'])?$order['product']['supplier']:'');
			$sheet->setCellValueByColumnAndRow(5, $rowCounter, $supllier);
			$sheet->setCellValueByColumnAndRow(6, $rowCounter, $order['SAP']);
			$sheet->setCellValueByColumnAndRow(7, $rowCounter, $order['costcentrecode']);
			$sheet->setCellValueByColumnAndRow(8, $rowCounter, '');
			$sheet->setCellValueByColumnAndRow(9, $rowCounter, '');
			$sheet->setCellValueByColumnAndRow(10, $rowCounter, $order['channel']);
			$sheet->setCellValueByColumnAndRow(11, $rowCounter, $order['customer']);
			$sheet->setCellValueByColumnAndRow(12, $rowCounter, $order['promotion_title']);
			$sheet->setCellValueByColumnAndRow(13, $rowCounter, '');
			$sheet->setCellValueByColumnAndRow(14, $rowCounter, '');
			$sheet->setCellValueByColumnAndRow(15, $rowCounter, '');
			$sheet->setCellValueByColumnAndRow(16, $rowCounter, $order['product']['DFID']);
			$oDisplay = new cDisplaysModel( $order['product']['display_id'] );
			$sheet->setCellValueByColumnAndRow(17, $rowCounter, $this->displayTypeExportNames[$oDisplay->get('displaytype')]);
			$sheet->setCellValueByColumnAndRow(18, $rowCounter, 'Promotion');
			$sheet->setCellValueByColumnAndRow(19, $rowCounter, $order['display_quantity']);
			$sheet->setCellValueByColumnAndRow(20, $rowCounter, '');
			$sheet->setCellValueByColumnAndRow(21, $rowCounter, '');
			$sheet->setCellValueByColumnAndRow(22, $rowCounter, '');
			$sheet->setCellValueByColumnAndRow(23, $rowCounter, $order['net_sales']);
			$sheet->setCellValueByColumnAndRow(24, $rowCounter, $oDisplay->get('articlenr'));
			$sheet->setCellValueByColumnAndRow(25, $rowCounter, $order['filled_empty']);
			$sheet->setCellValueByColumnAndRow(26, $rowCounter, $order['date']);
			$sheet->setCellValueByColumnAndRow(27, $rowCounter, $order['hex']);
			$oCostNo = cCostNoModel::getByUserId($order['userid']);
			$costcentre_costno = empty( $order['costcentre_costno'] ) ? $oCostNo->get('costno') : $order['costcentre_costno'];
			$sheet->setCellValueByColumnAndRow(28, $rowCounter, $costcentre_costno);
			if( isset( $order['topsign']['title'] ) ){
				$sheet->setCellValueByColumnAndRow(29, $rowCounter, $order['topsign']['articlenr']);
			}
			/*
			$status = ($order['status'] == 'archive')?'o':'';
			$sheet->setCellValueByColumnAndRow(8, $rowCounter, $status);
			$oCostNo = new cCostNoModel($order['costcentre']);
			$sheet->setCellValueByColumnAndRow(13, $rowCounter, $order['product']['SAP']);
			$sheet->setCellValueByColumnAndRow(14, $rowCounter, $order['delivery']);
*/



			$numbers = '';
			$units = '';
			$titles = '';
			//$DCs = '';
			foreach( $order['product']['article'] as $article){
				$numbers .= $article['articlenr'].'
';
				$titles .= $article['title'].'
';
				$units .= $article['units'].'
';

			}
			//$sheet->setCellValueByColumnAndRow(14, $rowCounter, $DCs);
			$sheet->setCellValueByColumnAndRow(30, $rowCounter, $numbers);
			$sheet->setCellValueByColumnAndRow(31, $rowCounter, $titles);
			$sheet->setCellValueByColumnAndRow(32, $rowCounter, $units);
			$sheet->setCellValueByColumnAndRow(33, $rowCounter, $order['pallet_quantity']);


			foreach( $order['product']['display_parts'] as $displayPart){
				if($first){
					$sheet->setCellValueByColumnAndRow($displayPartsById[$displayPart['id']]-1,1, 'Display Parts');
					$first = false;
				}

				$sheet->setCellValueByColumnAndRow($displayPartsById[$displayPart['id']], 1, $displayPart['articlenr']);
				$sheet->setCellValueByColumnAndRow($displayPartsById[$displayPart['id']], $rowCounter, $displayPart['units']*$order['display_quantity']);
			}

			$rowCounter++;
		}


		$writer = new PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment; filename="export.xls"');
		$writer->save("php://output");
	}

	public function displayRequest(){
		$postData = json_decode(file_get_contents('php://input'),true);
		if($postData['topsignImageId']){
			$oImage = new cImageModel($postData['topsignImageId']);
		}
		else{
			$oImage = false;
		}
		cMail::sentMail('display_request', array('image' => $oImage, 'requestText' => $postData['requestText']));
	}

	public function changeOrder(){
		$postData = json_decode(file_get_contents('php://input'),true);
		if(empty($postData['mad'])){

		}
		else{
			$postData['mad'] = date('Y-m-d H:m:s', strtotime($postData['mad']));
		}


		$cOrderModel = new cOrderModel($postData['id']);

		$cOrderModel->set('crosscharge', $postData['crosscharge']);
		$cOrderModel->set('delivery', $postData['dt']);
		$cOrderModel->set('filled_empty', $postData['filled_empty']);
		$cOrderModel->set('mad', $postData['mad']);
		$cOrderModel->set('net_sales', $postData['net_sales']);
		$cOrderModel->set('status', $postData['status']);
		$cOrderModel->set('tracking', $postData['tracking']);
		$cOrderModel->save();

		$this->orders();
	}
}
