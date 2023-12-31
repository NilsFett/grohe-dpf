<?php
/*
Copyright (c) 2016 Nils Fett

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/*
function __autoload($sClassName) {

	if(! class_exists($sClassName)){
		$oConfig = cConfig::getInstance();


		if(is_file($oConfig->get('basepath').'classes/'.$sClassName.'.php'))
    		require_once $oConfig->get('basepath').'classes/'.$sClassName.'.php';
		elseif(is_file($oConfig->get('basepath').'models/'.$sClassName.'.php'))
    		require_once $oConfig->get('basepath').'models/'.$sClassName.'.php';
		elseif(is_file($oConfig->get('basepath').'controllers/'.$sClassName.'.php'))
    		require_once $oConfig->get('basepath').'controllers/'.$sClassName.'.php';
		elseif(is_file($oConfig->get('basepath').'views/'.$sClassName.'.php'))
    		require_once $oConfig->get('basepath').'views/'.$sClassName.'.php';
    	else
    		throw new Exception('Class '.$sClassName.' not found !');
	}
}
*/

spl_autoload_register(function ($sClassName) {
	if(! class_exists($sClassName)){
		$oConfig = cConfig::getInstance();
/*
		echo '<p>'.$oConfig->get('basepath').'classes/'.$sClassName.'.php'.'</p>';
		echo '<p>'.$oConfig->get('basepath').'models/'.$sClassName.'.php'.'</p>';
		echo '<p>'.$oConfig->get('basepath').'controllers/'.$sClassName.'.php'.'</p>';
		echo '<p>'.$oConfig->get('basepath').'views/'.$sClassName.'.php</p>';
*/

		if(is_file($oConfig->get('basepath').'classes/'.$sClassName.'.php'))
    		require_once $oConfig->get('basepath').'classes/'.$sClassName.'.php';
		elseif(is_file($oConfig->get('basepath').'models/'.$sClassName.'.php'))
    		require_once $oConfig->get('basepath').'models/'.$sClassName.'.php';
		elseif(is_file($oConfig->get('basepath').'controllers/'.$sClassName.'.php'))
    		require_once $oConfig->get('basepath').'controllers/'.$sClassName.'.php';
		elseif(is_file($oConfig->get('basepath').'views/'.$sClassName.'.php'))
    		require_once $oConfig->get('basepath').'views/'.$sClassName.'.php';
    			if(! class_exists($sClassName)){
		$oConfig = cConfig::getInstance();		
		$parts = explode('\\', $sClassName);
		$withoutNamespace = end($parts);		
		$sClassNamePath = str_replace('\\','/',$sClassName);		

		if(is_file($oConfig->get('basepath').'libs/'.$sClassNamePath.'.php')){
    		require_once $oConfig->get('basepath').'libs/'.$sClassNamePath.'.php';
		}
		elseif(is_file($oConfig->get('basepath').'libs/'.$sClassNamePath.'/'.$withoutNamespace.'.php')){
    		require_once $oConfig->get('basepath').'libs/'.$sClassNamePath.'/'.$withoutNamespace.'.php';
		}
		elseif(is_file($oConfig->get('basepath').'libs/simple-cache/'.$withoutNamespace.'.php')){
    		require_once $oConfig->get('basepath').'libs/simple-cache/'.$withoutNamespace.'.php';
		}
		elseif(is_file($oConfig->get('basepath').'libs/PhpOffice/PhpSpreadsheet/Writer/'.$sClassName.'.php')){
    		require_once $oConfig->get('basepath').'libs/PhpOffice/PhpSpreadsheet/Writer/'.$sClassName.'.php';
		}
    	else{
    		throw new Exception('Class '.$sClassName.' not found !');
		}
	}

	}
});
