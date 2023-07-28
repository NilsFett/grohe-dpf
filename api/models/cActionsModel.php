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
*
*
*
-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 27. Feb 2019 um 10:57
-- Server-Version: 5.7.25-0ubuntu0.16.04.2
-- PHP-Version: 7.0.33-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Datenbank: `grohe`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `actions`
--

DROP TABLE IF EXISTS `actions`;
CREATE TABLE `actions` (
  `id` int(11) NOT NULL,
  `enviroment_id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `url` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `actions`
--

INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES
(1, 1, 'getDisplays', '/getDisplays'),
(2, 1, 'getDisplaysParts', '/getDisplaysParts'),
(3, 1, 'isLoggedIn', '/isLoggedIn'),
(4, 1, 'login', '/login'),
(5, 1, 'logout', '/logout'),
(6, 1, 'register', '/register'),
(7, 1, 'getCountries', '/getCountries'),
(8, 1, 'getUserRequests', '/getUserRequests'),
(9, 1, 'acceptUserRequest', '/acceptUserRequest'),
(10, 1, 'declineUserRequest', '/declineUserRequest'),
(11, 1, 'getDisplayParts', '/getDisplayParts'),
(12, 1, 'changeDisplayPart', '/changeDisplayPart'),
(13, 1, 'deleteDisplayPart', '/deleteDisplayPart');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `actions`
--
ALTER TABLE `actions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `actions`
--
ALTER TABLE `actions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
*/
class cActionsModel extends cModel{

	protected $aColumns = array(
		'id' => array(
			'value' => false,
			'type' => 'int'
		),
		'name' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'url' => array(
			'value' => false,
			'type' => 'varchar'
		),
		'enviroment_id' => array(
			'value' => false,
			'type' => 'int'
		)
	);
	protected $sTable = 'actions';
	protected $sPrimary = 'id';

	protected $aActions = NULL;

	public function __construct($aData = false){
		parent::__construct($aData);
	}

	public function getActionsByEnviromentName($nEnviromentName){
		if(is_array($this->aActions)){
			return $this->aActions;
		}
		$query = '	SELECT `actions`.*
					FROM `actions`, `enviroments`
					WHERE `enviroments`.name = "'.$nEnviromentName.'"
					AND `enviroments`.ID = `actions`.enviroment_id';

		$this->hRessource = $this->hConnection->query($query);
		$aActions = $this->hRessource->fetchAll();
		foreach ($aActions as $aAction){
			$this->aActions[$aAction['name']] = $aAction;
		}
		return $this->aActions;
	}
}
