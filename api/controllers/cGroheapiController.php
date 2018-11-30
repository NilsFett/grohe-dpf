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

	}
	
	
	
	public function getDisplays(){
		$displays = cDisplaysModel::getAll();
		echo json_encode($displays);
	}

	public function getDisplaysParts(){
		$displays = cDisplaysPartsModel::getPartsToDisplays();
		echo json_encode($displays);
	}
		
	public function addMenuItem(){
		$postData = json_decode(file_get_contents('php://input'),true);
		
		$oPageModel = new cPageModel();
		$oPageModel->set('name', $postData['name']);
		$oPageModel->set('menu_id', $postData['menu_id']);
		$oPageModel->set('parent_id', $postData['parent_id']);
		$oPageModel->set('published', 1);
		$oPageModel->set('deleted', 0);
		$oPageModel->setOrderNumber();
		$oPageModel->save();
		$this->getMenues();
	}
	
	public function changeMenuItem(){
		$postData = json_decode(file_get_contents('php://input'),true);
		
		$oPageModel = new cPageModel($postData['id']);		
		$oPageModel->set('name', $postData['name']);
		$oPageModel->set('menu_id', $postData['menu_id']);		
		$oPageModel->set('published', 1);
		$oPageModel->set('deleted', 0);		
		
		if($oPageModel->get('parent_id') != $postData['parent_id']){
			$oldParentId = $oPageModel->get('parent_id');			
			$oldOrderNumber = $oPageModel->get('order_number');
			if($oldParentId){
				$oldParent = new cPageModel($oldParentId);
			}
			else{
				$oldParent = new cPageModel();
				$oldParent->set('menu_id', $postData['menu_id']);
				$oldParent->set('parent_id', 0);
			}
			if($postData['parent_id']){
				$newParent = new cPageModel($postData['parent_id']);
			}
			else{
				$newParent = new cPageModel();
				$newParent->set('menu_id', $postData['menu_id']);
				$newParent->set('parent_id', 0);
			}
			$order_number = $newParent->getMaxChildsOrderNumber()+1;			
			$oPageModel->set('order_number', $order_number);
		}
		else{
			$oPageModel->changeOrderNumber($postData['order_number']);
		}
		$oPageModel->set('parent_id', $postData['parent_id']);
		$oPageModel->save();
		if(isset($oldParent)){
			$oldParent->reduceOrderNumberAt($oldOrderNumber);
		}
		$this->getMenues();
	}
	
	public function menuItemDelete(){
		$postData = json_decode(file_get_contents('php://input'),true);
		$oPageModel = new cPageModel($postData['id']);
		$orderNumber = $oPageModel->get('order_number');
		$oPrevPageModel = new cPageModel($oPageModel->getPrevId());
		
		

		if($oPrevPageModel->get('id')){
			$oPageModel->delete();
			$oParentPageModel->reduceOrderNumberAt($orderNumber);
		}
		else{
			$oNextPageModel = new cPageModel($oPageModel->getNextId());
			if($oNextPageModel->get('id')){
				$oPageModel->delete();
				$oNextPageModel->reduceOrderNumberAt($orderNumber);
			}
			else{
				$oPageModel->delete();
			}
		}
		$this->getMenues();
	}
	
	
	
	public function getPageStructure(){
/*
		echo '<pre>';
		print_r(cStructureModel::getTreeByPageId(1));
*/
		echo json_encode(cStructureModel::getTreeByPageId($_GET['id']));
	}
	
	public function saveText(){
		$postData = json_decode(file_get_contents('php://input'),true);
		$oText = new cTextModel($postData['id']);
		$oText->set('html', $postData['html']);
		$oText->save();
		echo json_encode(array('success'=>true));
	}
	
	public function executeChangeStack(){
		$this->postData = json_decode(file_get_contents('php://input'),true);
		echo '<pre>';
		var_dump($this->postData);

		foreach( $this->postData as &$action ){
			if(isset($action['newObject']['tempId'])){
				$this->newlyCreatedComponentsDuringExecuteChangeStackByTempId[$action['newObject']['tempId']] = &$action['newObject'];
			}
			if(isset($action['objectChanging']['tempId']) ){
				$this->changingComponentsDuringExecuteChangeStackByTempId[$action['objectChanging']['tempId']] = &$action['objectChanging'];
			}			
			switch($action['action']){
				case 'addComponent':
					$this->addComponent($action);
				break;
				case 'deleteComponent':
					$this->deleteComponent($action);
				break;
			}
		}
		
		var_dump($this->postData);
		json_encode($this->postData);
		exit();
	}
	
	public function addComponent(&$action){
		
		/*
		$postData = json_decode(file_get_contents('php://input'),true);	
		*/
		$parentId = $action['objectChanging']['id'];
		
		if( isset($action['objectChanging']['tempId'])
			&& isset( $this->newlyCreatedComponentsDuringExecuteChangeStackByTempId[$action['objectChanging']['tempId']]) 
			&& $this->newlyCreatedComponentsDuringExecuteChangeStackByTempId[$action['objectChanging']['tempId']]['id'] ){
			$parentId = $this->newlyCreatedComponentsDuringExecuteChangeStackByTempId[$action['objectChanging']['tempId']]['id'];
		}
		
		$slotId = $action['objectChanging']['slot_id'];
		$pageId = $action['objectChanging']['page_id'];
		$isStructureComponent = $action['newObject']['isStructureComponent'];
		$type = $action['newObject']['type'];
		$texts = $action['newObject']['texts'];
		if($parentId < 0){
			$slotId = ( $parentId * -1 );
			$parentId = 0;
			$isStructureComponent = true;
		}

		if($isStructureComponent){
			$oParentElement = new cStructureModel($parentId);
			$oNewElement = new cStructureModel();
			$oNewElement->set('parent_id', $parentId);
			$oNewElement->set('slot_id', $slotId);
			$oNewElement->set('type', $type);
			$oNewElement->set('order_number', $oParentElement->getMaxChildsOrderNumber()+1 );
			$oNewElement->save();
			if(isset($this->newlyCreatedComponentsDuringExecuteChangeStackByTempId[$action['newObject']['tempId']])){
				$this->newlyCreatedComponentsDuringExecuteChangeStackByTempId[$action['newObject']['tempId']]['id'] = $oNewElement->get('id');
			}
			if(isset($action['objectChanging']['tempId']) && isset($this->changingComponentsDuringExecuteChangeStackByTempId[$action['objectChanging']['tempId']])){
				$this->changingComponentsDuringExecuteChangeStackByTempId[$action['objectChanging']['tempId']]['id'] = $parentId;
			}			
			$oStructurePagesModel = new cStructurePagesModel();
			$oStructurePagesModel->set('page_id', $pageId);
			$oStructurePagesModel->set('structure_id', $oNewElement->get('id'));
			$oStructurePagesModel->save();
		}
		else{
			$oNewElement = new cContentModel();
			$oNewElement->set('page_id', $pageId);
			$oNewElement->set('structure_id', $parentId);
			$oNewElement->set('order_number', $oNewElement->getMaxOrderNumber()+1);
			$oNewElement->set('type', $type);
			$oNewElement->save();
			
			if($texts){
				$oText = new cTextModel();
				$oText->set('html', '');
				$oText->set('order_number', 1);
				$oText->save();
				
				$oContentTexts = new cContentTextsModel();
				$oContentTexts->set('content_id', $oNewElement->get('id'));
				$oContentTexts->set('text_id', $oText->get('id'));
				$oContentTexts->save();
				$postData['texts'] = array(1=>array('id'=>$oText->get('id'),'html'=>''));
			}
			/*
			if($postData['resources']){
				$oResourcesModel = new cResourcesModel();
				$oResourcesModel->set('type', '');
				$oResourcesModel->set('path_id', 0);
				$oResourcesModel->set('order_number', 1);
				$oResourcesModel->save();
				
				$oContentTexts = new cContentResourcesModel();
				$oContentTexts->set('content_id', $oNewElement->get('id'));
				$oContentTexts->set('resources_id', $oText->get('id'));
				$oContentTexts->save();
				$postData['resources'] = array(1=>array('id'=>$oResourcesModel->get('id')));
			}
			*/
		}
		$postData['id'] = $oNewElement->get('id');
		$postData['order'] = $oNewElement->get('order_number');
		//echo json_encode($postData);
	}
	
	public function deleteComponent(&$action){
		//$postData = json_decode(file_get_contents('php://input'),true);
		if($action['objectChanging']['isStructureComponent']){
			$oStructureModel = new cStructureModel($action['objectChanging']['id']);
			$oStructureModel->deleteRecursive($action['objectChanging']['page_id']);
		}
		else{
			$oContentModel = new cContentModel($action['objectChanging']['id']);
			$oContentModel->delete();
		}
	}
	
	public function changeType(){
		$postData = json_decode(file_get_contents('php://input'),true);

		$oStructureModel = new cStructureModel($postData['id']);
		$oStructureModel->set('type', $postData['type']);
		$oStructureModel->save();

		$postData['success'] = true;
		echo json_encode($postData);
	}
	
	
	public function saveProperity(){
		$postData = json_decode(file_get_contents('php://input'),true);
		cPropertiesModel::replace($postData['id'], ($postData['isStructureComponent']?'structure':'content'), $postData['propName'], $postData['probValue']);
		echo json_encode($postData);		
	}

	public function saveProperityMenu(){
		$postData = json_decode(file_get_contents('php://input'),true);
		cPropertiesModel::replace($postData['id'], ($postData['parent_type']), $postData['propName'], $postData['propValue']);
		echo json_encode($postData);		
	}
		
	public function moveAfter(){
		$postData = json_decode(file_get_contents('php://input'),true);
		echo json_encode($postData);		
	}

	public function movePrepend(){
		$postData = json_decode(file_get_contents('php://input'),true);
		
		if($postData['targetElementIsStructure'] == false && $postData['movingElementIsStructure'] == true){
			echo json_encode(array('success'=>false,'error'=>'structure element must not be put in content element'));
		}
		
		if($postData['targetElementIsStructure'] && $postData['movingElementIsStructure'] == false){
			$oTargetElement = new cStructureModel($postData['targetElementId']);
			$oMovingElement = new cContentModel($postData['movingElementId']);
			$nOldOrderNumber = $oMovingElement->get('order_number');
			$oOldTargetElement = new cStructureModel($oMovingElement->get('structure_id'));
			
			cContentModel::increaseOrderNumberAt(0,$oTargetElement->get('id'), $oMovingElement->get('language'));
			
			$oMovingElement->set('structure_id', $oTargetElement->get('id'));
			$oMovingElement->set('order_number', 1);
			
			
			$oMovingElement->save();
			
			$oOldTargetElement->reduceOrderNumberAt($nOldOrderNumber);
		}

		echo json_encode($postData);		
	}
	
	public function moveAppend(){
		$postData = json_decode(file_get_contents('php://input'),true);
		
		if($postData['targetElementIsStructure'] == false && $postData['movingElementIsStructure'] == true){
			echo json_encode(array('success'=>false,'error'=>'structure element must not be put in content element'));
		}
		
		if($postData['targetElementIsStructure'] && $postData['movingElementIsStructure'] == false){
			$oTargetElement = new cStructureModel($postData['targetElementId']);
			$oMovingElement = new cContentModel($postData['movingElementId']);
			$nOldOrderNumber = $oMovingElement->get('order_number');
			$oOldTargetElement = new cStructureModel($oMovingElement->get('structure_id'));
			$oMovingElement->set('structure_id', $oTargetElement->get('id'));
			$oMovingElement->set('order_number', ($oTargetElement->getMaxChildsOrderNumber()+1));
			$oMovingElement->save();
			
			$oOldTargetElement->reduceOrderNumberAt($nOldOrderNumber);
		}

		echo json_encode($postData);		
	}
	
	public function componentUp(){
		$postData = json_decode(file_get_contents('php://input'),true);
		if($postData['movingElementIsStructure']){
			$oMovingElement = new cStructureModel($postData['movingElementId']);
		}
		else{
			$oMovingElement = new cContentModel($postData['movingElementId']);
		}

		if($oMovingElement->get('order_number') == 1){
			echo json_encode($postData);
		}
		else{
			$prevElementId = $oMovingElement->getPrevId();
			if($postData['movingElementIsStructure']){
				$prevElement = new cStructureModel($prevElementId);				
			}
			else{
				$prevElement = new cContentModel($prevElementId);
			}
			$prevElement->set('order_number', 0);
			$prevElement->save();
			$oldOrderNumber = $oMovingElement->get('order_number');
			$oMovingElement->set('order_number', ($oldOrderNumber - 1) );
			$oMovingElement->save();
			$prevElement->set('order_number', $oldOrderNumber);
			$prevElement->save();
			$postData['success'] = true;
			echo json_encode($postData);
		}
	}
	
	public function componentDown(){
		$postData = json_decode(file_get_contents('php://input'),true);
		$oMovingElement = new cContentModel($postData['movingElementId']);

		if($oMovingElement->get('order_number') == $oMovingElement->getMaxOrderNumber()){
			echo json_encode($postData);
		}
		else{
			$nextElementId = $oMovingElement->getNextId();

			$nextElement = new cContentModel($nextElementId);
			$nextElement->set('order_number', 0);
			$nextElement->save();
			$oldOrderNumber = $oMovingElement->get('order_number');
			$oMovingElement->set('order_number', ($oldOrderNumber + 1) );
			$oMovingElement->save();
			$nextElement->set('order_number', $oldOrderNumber);
			$nextElement->save();
			$postData['success'] = true;
			echo json_encode($postData);
		}
	}
	
	public function saveResources(){
		$postData = json_decode(file_get_contents('php://input'),true);
		cContentResourcesModel::setNew($postData['elementResourcesChanged']['id'], $postData['resources']);
		echo json_encode($postData);
	}

	public function deleteResource(){
		$postData = json_decode(file_get_contents('php://input'),true);
		cContentResourcesModel::deleteAllWithResourceId($postData['resourceId']);
		$oResourcesModel = new cResourcesModel($postData['resourceId']);
		if(is_file(cConfig::getInstance()->get('basepath')."html/public/resources/".$oResourcesModel->get('hash').".".$oResourcesModel->get('extension'))){
			unlink(cConfig::getInstance()->get('basepath')."html/public/resources/".$oResourcesModel->get('hash').".".$oResourcesModel->get('extension'));
		}
		if(is_file(cConfig::getInstance()->get('basepath')."html/public/resources/thumbs/".$oResourcesModel->get('hash').".".$oResourcesModel->get('extension'))){
			unlink(cConfig::getInstance()->get('basepath')."html/public/resources/thumbs/".$oResourcesModel->get('hash').".".$oResourcesModel->get('extension'));
		}
		$postData['success'] = true;
		$oResourcesModel->delete();
		echo json_encode($postData);
	}
		
	public function loadMediathekFiles(){
		echo json_encode(cResourcesModel::getAll());
	}
	
	public function fileUpload(){
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

				if(cResourcesModel::resourceExists($sHash, 1)){
					$aErrors[] = 'File '.$aImage['name'].' existiert bereits in diesem Ordner.';
				}
				else{
					if(move_uploaded_file($aImage['tmp_name'], cConfig::getInstance()->get('basepath').'html/public/resources/'.$sHash.'.'.$sExtension)) {
						$oResource = new cResourcesModel();
						$oResource->set('name', $aImage['name']);
						$oResource->set('hash', $sHash);
						$oResource->set('extension', $sExtension);
						$oResource->set('path_id', 1);
						$oResource->set('type', $aImage['type']);
						$oResource->set('filesize', $aImage['size']);
						$oResource->set('upload_timestamp', time());
			

						if( $aImage['type'] == 'image/jpeg' || $aImage['type'] == 'image/gif' || $aImage['type'] == 'image/png' ){
							if(isset($aSize[0])){
								$oResource->set('width', $aSize[0]);
							}
							if(isset($aSize[1])){
								$oResource->set('height', $aSize[1]);
							}	
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
							
							$image = new Imagick(cConfig::getInstance()->get('basepath')."html/public/resources/".$sHash.".".$sExtension);
							
							$image->resizeImage($newWidth, $newHeight, imagick::FILTER_CUBIC, 1, true);
							//$image->cropThumbnailImage($newWidth,$newHeight);
							$image->writeImage( cConfig::getInstance()->get('basepath')."html/public/resources/thumbs/".$sHash.".".$sExtension );
						}
						$oResource->save();
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
