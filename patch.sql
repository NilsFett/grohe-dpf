ALTER TABLE `t_user` ADD `session_id` VARCHAR(255) NOT NULL AFTER `password`;
ALTER TABLE `t_user` ADD `cookie` VARCHAR(255) NOT NULL AFTER `session_id`;
ALTER TABLE `t_user` CHANGE `session_id` `session_id` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL;
ALTER TABLE `t_user` CHANGE `cookie` `cookie` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL;
ALTER TABLE `t_user` CHANGE `deleted` `deleted` TINYINT(4) NOT NULL DEFAULT '0';

INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'isLoggedIn', '/isLoggedIn');
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'login', '/login');
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'logout', '/logout');
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'register', '/register');
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'getCountries', '/getCountries');
INSERT INTO `actions` (`id`, `enviroment_id`, `name`, `url`) VALUES (NULL, '1', 'getUserRequests', '/getUserRequests');

