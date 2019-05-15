<?php
/*
Copyright (c) 2017 Nils Fett

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
class cMail{
	static $oInstance = NULL;


	private function __construct(){

	}

	static public function getInstance(){
		if(self::$oInstance == NULL){
			self::$oInstance = new cMail();
		}
		return self::$oInstance;
	}

	public static function sentMail($sTemplate, $data){
		$oMailView = new cView();

		$oSessionUser = cSessionUser::getInstance();

		$boundary = uniqid('np');
		$oMailView->assign('boundary', $boundary);
		switch ($sTemplate){
			case 'new_registration':
				$subject = 'Grohe - Display Factory Admin - New User Request';
				$oMailView->setTemplate($sTemplate);
				$oMailView->assign('user', $data['user']);
				$oMailView->assign('costno', $data['costno']);
				$mail_body = $oMailView->render();
//				$recipient = array('Vanessa.Wittmer@grohe.com');
				$recipient = array('mail@nils-fett.de');

			break;
			case 'account_released':
				$subject = 'Grohe - Display Factory - Your User Account has been released.';
				$oMailView->setTemplate($sTemplate);
				$oMailView->assign('user', $data['user']);
				$oMailView->assign('password', $data['password']);
				$mail_body = $oMailView->render();
				$recipient = array($data['user']->get('mail'));
			break;
			case 'password_reset':
				$subject = 'Grohe - Display Factory - Your new password';
				$oMailView->setTemplate($sTemplate);
				$oMailView->assign('user', $data['user']);
				$oMailView->assign('password', $data['password']);
				$mail_body = $oMailView->render();
				$recipient = array($data['user']->get('mail'));
			break;
			case 'new_order':
				$subject = 'Grohe - Display Factory - New Display Order';
				$oMailView->setTemplate($sTemplate);
				$oMailView->assign('order', $data['order']);
				$oMailView->assign('product', $data['product']);
				$oMailView->assign('user', $data['user']);
				$oMailView->assign('topsign', $data['topsign']);
				$oMailView->assign('costno', $data['costno']);
				$oMailView->assign('displayPartsWeight', $data['displayPartsWeight']);
				$oMailView->assign('articlesWeight', $data['articlesWeight']);
				$mail_body = $oMailView->render();
				$recipient = array($data['user']->get('mail'), 'mail@nils-fett.de', 'Vanessa.Wittmer@grohe.com');
			break;
			/*
			case 'order_success':
				$subject = 'Grohe - Display Factory - Your request has been submitted successfully';
				$oMailView->setTemplate($sTemplate);
				$oMailView->assign('order', $data['order']);
				$oMailView->assign('user', $data['user']);
				$mail_body = $oMailView->render();
				$recipient = array($data['user']->get('mail'));
			break;
			*/
		}


		$subject = '=?UTF-8?B?'.base64_encode($subject).'?=';
		$headers   = array();
		$headers[] = "MIME-Version: 1.0";
		$headers[] = "Content-Type: multipart/alternative;boundary=\"" . $boundary ."\"";
		$headers[] = "From: admin@grohe2.hoehne-media.de <admin@grohe2.hoehne-media.de>";

		$headers[] = "Reply-To: admin@grohe-hoehne-media.de";
		$headers[] = "X-Mailer: PHP/".phpversion();


		foreach($recipient as $email){
			if(cConfig::getInstance()->get('debug')){
				echo '<h1>'.$email.'</h1>';
				echo '<h2>'.$subject.'</h2>';
				echo $mail_body;
			}
			else{
				$success = mail($email, $subject, $mail_body, implode("\r\n",$headers));

				//$success = mail($email, $subject, $mail_body, implode("\r\n",$headers));
			}
		}

	}
}
