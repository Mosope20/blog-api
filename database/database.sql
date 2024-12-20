CREATE TABLE `blog_db`.`users` (
  `userId` VARCHAR(55) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(125) NOT NULL,
  `banned` TINYINT(0) NOT NULL,
  PRIMARY KEY (`userId`));
