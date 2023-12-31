<?php
/*
Copyright (c) 2019 Nils Fett

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
session_set_cookie_params([
					'path'=>'/',
				/*	'expires'=> time() + 60 * 60 * 24 * 365,*/
					'samesite' => 'None',
					'secure' => true,
					'httponly' => true,
				'domain' => 'grohe-dpf.localdomain']);
session_start();
//header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');
if ($_SERVER['REQUEST_METHOD']=='OPTIONS') {
	exit();
}

ignore_user_abort(true);
ini_set('display_errors','On');
ini_set('track_errors', 1);
ini_set('error_reporting', E_ALL);
ini_set('max_execution_time', 0);
error_reporting(E_ALL ^ E_DEPRECATED);

set_error_handler(function($errno, $errstr, $errfile, $errline ){
    throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
});
try{

	require('cConfig.php');
	require('autoloader.php');
	require('./functions/functions.php');

	cSystem::getInstance()->init();
	$action = cSystem::getInstance()->getAction();
	$env = cSystem::getInstance()->getEnviroment();
	$sController = 'c'.ucfirst($env).'Controller';
	$oController = $sController::getInstance();
	$oController->{$action}();
}
catch(Exception $e){


	echo '<pre><h1>'.$e->getMessage().'</h1>';



	foreach( $e->getTrace() as $aStep ){

		if( isset( $aStep['file'] ) ){
			echo '<p>'.$aStep['file'].' at line'.$aStep['line'].'</p>';
			echo '<p>Funtion '.$aStep['function'].'</p>';
		}
		else{
			var_dump($aStep);
		}


	}

}
