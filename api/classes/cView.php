<?php
class cView{

	private $sEnviroment = false;
  private $sTemplate;
  private $sTemplateSplittest;
  private $sTemplatePath;
  private $aData;

	public function __construct(){
		$this->sTemplate = '';
		$this->sTemplateSplittest = false;
		$this->sTemplatePath = '';
		$this->aData = array();
	}

	public function setTemplate($sTemplate){
		 $this->sTemplate = $sTemplate;
		 return $this;
	}


	public function setEnviroment($sEnviroment){
		$this->sEnviroment = $sEnviroment;
	}

	public function getEnviroment(){
		if( $this->sEnviroment ){
			return $this->sEnviroment;
		}
		else{
			return cSystem::getInstance()->getEnviroment();
		}
	}

	public function assign($sKey, $aData){
		$this->aData[$sKey] = $aData;
		return $this;
	}

	public function render(){

		$sRenderTemplate = $this->sTemplate;
		if($this->sTemplateSplittest){
			$sRenderTemplate = $this->sTemplateSplittest;
		}
		if( $this->sEnviroment ){
			$env = $this->sEnviroment;
		}
		else{
			$env = cSystem::getInstance()->getEnviroment();
		}
		ob_start();
		if(is_file(cConfig::getInstance()->get('basepath').'/views/'.$sRenderTemplate.'.phtml')){

			require(cConfig::getInstance()->get('basepath').'/views/'.$sRenderTemplate.'.phtml');
		}
		elseif(is_file(cConfig::getInstance()->get('basepath').'/views/email/'.$sRenderTemplate.'.phtml')){

			require(cConfig::getInstance()->get('basepath').'/views/email/'.$sRenderTemplate.'.phtml');
		}
		else{
			echo $this->sTemplatePath = cConfig::getInstance()->get('basepath').'/views/'.$sRenderTemplate.'.phtml';
			throw new Exception('Template '.$sRenderTemplate.' not found.');
		}
		$view = ob_get_contents();
		ob_end_clean();
		return $view;
	}

	private function renderPart($part){
		require(cConfig::getInstance()->get('basepath').'views/parts/'.$part.'.phtml');
	}

	public function isMobile()
	{
		return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
	}
}
