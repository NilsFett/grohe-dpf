ALTER TABLE `t_user` ADD `session_id` VARCHAR(255) NOT NULL AFTER `password`;
ALTER TABLE `t_user` ADD `cookie` VARCHAR(255) NOT NULL AFTER `session_id`;
ALTER TABLE `t_user` CHANGE `session_id` `session_id` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL;
ALTER TABLE `t_user` CHANGE `cookie` `cookie` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL;
ALTER TABLE `t_user` CHANGE `deleted` `deleted` TINYINT(4) NOT NULL DEFAULT '0';

DROP TABLE IF EXISTS `actions`;
CREATE TABLE `actions` (
  `id` int(11) NOT NULL,
  `enviroment_id` int(11) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `url` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
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
(13, 1, 'deleteDisplayPart', '/deleteDisplayPart'),
(14, 1, 'getArticles', '/getArticles'),
(15, 1, 'changeArticle', '/changeArticle'),
(16, 1, 'deleteArticle', '/deleteArticle');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;


ALTER TABLE `t_articles` CHANGE `deleted` `deleted` TINYINT(4) NOT NULL DEFAULT '0';
ALTER TABLE `t_display_parts` CHANGE `open_format` `open_format` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL;
ALTER TABLE `t_display_parts` CHANGE `stock` `stock` INT(11) NULL;
