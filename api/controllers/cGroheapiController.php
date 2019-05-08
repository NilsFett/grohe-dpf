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
			echo json_encode($articles);
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

	public function saveProductAndArticleList(){
		$postData = json_decode(file_get_contents('php://input'),true);
		if( isset ($postData['product']['id']) ){
			$oProduct = new cProductsModel($postData['product']['id']);
			cRProductArticleModel::deleteByProductId($postData['product']['id']);
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

		$this->getProducts();
	}
  public function finishOrder(){
      $postData = json_decode(file_get_contents('php://input'),true);
			/*
			$postData = json_decode('{"product":{"id":"901","title":"Universal Display low base","DFID":"DF1015","empty_display":"0","display_id":"190","SAP":"9800111F","product_tree":"102","topsign_id":"1","promotion_material_id":"0","price":"25.00","pallet_select":"1","pallet_disabled":"0","bypack_disabled":"0","topsign_upload_disabled":"0","notopsign_order_disabled":"0","deliverytime":"5","image":"","image_thumb":"","hide":"0","old_system":"0","base_display_template_id":"1","displayID":"190","path":{"id":"102","path":"¼ Pallet","pathbyid":"102"},"article":[{"position":"901","article_id":"615","units":"14","id":"615","articlenr":"34565001","title":"GRT 800 THM Brause AP + Brs.garn.","extra":"","type":"Shower","packaging":"carton","weight":"3025","height":"80","width":"150","depth":"980","topsign":"0","deleted":"0","old_system":"0"}],"display_parts":[{"id":"98001352","title":"Sockelblende niedrig (0340922-BL2-02 inkl. SK-Band","articlenr":"98001503","image":"19","hide":"","displaytype":"1_4_chep_pallet","base_display_template_id":"1","topsign_punch":"","instruction":"3","old_system":"0","display_id":"190","part_id":"98001352","units":"1","length":"n/a","width":"565","height":"185","stock":"0","weight":"199","deleted":"0"},{"id":"98001358","title":"Stülper (0340922-HF1-01) - ohne Druck","articlenr":"98001540","image":"19","hide":"","displaytype":"1_4_chep_pallet","base_display_template_id":"1","topsign_punch":"","instruction":"3","old_system":"0","display_id":"190","part_id":"98001358","units":"1","length":"386","width":"588","height":"1173","stock":"0","weight":"1722","deleted":"0"},{"id":"98001361","title":"Mantel (0340922-MN-02) - 1/1 - fbg. Flexo + Glanzl","articlenr":"98001508","image":"19","hide":"","displaytype":"1_4_chep_pallet","base_display_template_id":"1","topsign_punch":"","instruction":"3","old_system":"0","display_id":"190","part_id":"98001361","units":"1","length":"365","width":"575","height":"1170","stock":"0","weight":"1524","deleted":"0"},{"id":"98001363","title":"1/4 wooden pallet","articlenr":"98001242","image":"19","hide":"","displaytype":"1_4_chep_pallet","base_display_template_id":"1","topsign_punch":"","instruction":"3","old_system":"0","display_id":"190","part_id":"98001363","units":"1","length":"200","width":"300","height":"n/a","stock":"0","weight":"2400","deleted":"0"}]},"quantity":1,"costcentre":"6","sap":"12345678","pit":"234","desired_date_delivery":""}');
			echo '<pre>';
			var_dump($postData->product);
			exit();
			*/		

      $postData['product']['display_type'] = $postData['product']['path']['path'];
      unset($postData['product']['path']);
      $order = cOrderModel::getCurrent();

			$order->set('date', date('Y-m-d H:i:s'));
			$order->set('costcentre', $postData['costcentre']);
			$userCostno = cCostNoModel::getByUserId(cSessionUser::getInstance()->get('id'));
			$order->set('costcentrecode', $userCostno->get('description'));
			$order->set('promotion_title', $postData['pit']);
			$order->set('SAP', $postData['sap']);
			$order->set('display_quantity', $postData['quantity']);
			$order->set('pallet_quantity', $postData['quantity']);
			$order->set('status', 'ordered');
			$order->set('product', serialize($postData['product']));

			$oTopSignModel = new cTopSignModel($postData['product']['topsign_id']);

			$order->set('topsign', serialize($oTopSignModel->getValuesArray()));
			$desired_date_delivery = date('Y-m-d H:i:s',strtotime($postData['desired_date_delivery']));

			$order->set('desired_date_delivery', $desired_date_delivery);
			$order->save();

			cMail::sentMail('new_order', array('order' => $order));
			cMail::sentMail('order_success', array('user' => cSessionUser::getInstance(), 'order' => $order));


			echo json_encode(array('success'=>true));
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
						$oImage->set('type', $type);



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

	public function orders(){

		if(cSessionUser::getInstance()->bIsLoggedIn){
			if(cSessionUser::getInstance()->get('usertype') == 'admin'){
				echo json_encode(cOrderModel::getAll());
			}
			else{
				echo json_encode(cOrderModel::getAllByUserId(cSessionUser::getInstance()->get('id')));
			}

		}
	}

}
