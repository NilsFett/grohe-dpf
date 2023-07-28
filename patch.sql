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
DELETE FROM `t_topsign` WHERE `deleted` = 1


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
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'productTree', '/productTree');
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'saveDisplayAndPartList', '/saveDisplayAndPartList');
ALTER TABLE `t_display_parts` ADD `old_system` TINYINT NOT NULL DEFAULT '0' AFTER `deleted`;
ALTER TABLE `t_articles` ADD `old_system` TINYINT NOT NULL DEFAULT '0' AFTER `deleted`;
UPDATE `t_articles` SET `old_system` = 1 WHERE 1;
ALTER TABLE `t_articles` ADD `height` INT NOT NULL AFTER `weight`;
ALTER TABLE `t_articles` ADD `width` INT NOT NULL AFTER `height`;
ALTER TABLE `t_articles` ADD `depth` INT NOT NULL AFTER `width`;
ALTER TABLE `t_topsign` ADD `old_system` TINYINT NOT NULL DEFAULT '0' AFTER `deleted`;
UPDATE `t_topsign` SET `old_system` = 1 WHERE 1;
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'loadTopSignes', '/loadTopSignes');

ALTER TABLE `t_images` ADD `type` INT NOT NULL AFTER `path`;
TRUNCATE `t_images` ;
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'deleteImage', '/deleteImage');


ALTER TABLE `t_articles` CHANGE `topsign` `topsign` INT(11) NULL;
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'loadArticlesByProductId', '/loadArticlesByProductId');
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'saveProductAndArticleList', '/saveProductAndArticleList');
ALTER TABLE `t_display_position` CHANGE `DFID` `DFID` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;

ALTER TABLE `t_display_parts` CHANGE `open_format` `length` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
ALTER TABLE `t_display_parts` ADD `width` VARCHAR(20) NOT NULL AFTER `length`;
ALTER TABLE `t_display_parts` ADD `height` VARCHAR(20) NOT NULL AFTER `width`;
ALTER TABLE `t_topsign` ADD `type` INT NOT NULL AFTER `articlenr`;
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'changeTopSign', '/changeTopSign');
ALTER TABLE `t_display_position` ADD `promotion_material_id` INT NOT NULL AFTER `topsign_id`;


ALTER TABLE `t_order` ADD `tracking` TINYINT NOT NULL DEFAULT '0' AFTER `crosscharge`;

UPDATE `t_order` SET `desired_date_delivery` = NULL WHERE `desired_date_delivery` = "0000-00-00 00:00:00"
ALTER TABLE `t_order` ADD `net_sales` VARCHAR(255) NOT NULL AFTER `tracking`;
ALTER TABLE `t_order` ADD `mad` VARCHAR(255) NOT NULL AFTER `net_sales`;
ALTER TABLE `t_order` ADD `filled_empty` VARCHAR(255) NOT NULL AFTER `mad`;
