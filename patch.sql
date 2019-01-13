ALTER TABLE `t_user` ADD `session_id` VARCHAR(255) NOT NULL AFTER `password`;
ALTER TABLE `t_user` ADD `cookie` VARCHAR(255) NOT NULL AFTER `session_id`;
ALTER TABLE `t_user` CHANGE `session_id` `session_id` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL;
ALTER TABLE `t_user` CHANGE `cookie` `cookie` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL;
ALTER TABLE `t_user` CHANGE `deleted` `deleted` TINYINT(4) NOT NULL DEFAULT '0';
