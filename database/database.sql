CREATE TABLE `blog_db`.`users` (
  `userId` VARCHAR(55) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(125) NOT NULL,
  `banned` TINYINT(0) NOT NULL,
  PRIMARY KEY (`userId`));

CREATE TABLE `blog_db`.`user_comments` (
  `commentId` VARCHAR(125) NOT NULL,
  `userId` VARCHAR(125) NOT NULL,
  `postId` VARCHAR(125) NOT NULL,
  `comment` VARCHAR(225) NOT NULL,
  `username` VARCHAR(125) NOT NULL,
  PRIMARY KEY (`commentId`));

  CREATE TABLE `blog_db`.`blog_posts` (
  `postId` VARCHAR(125) NOT NULL,
  `content` VARCHAR(500) NOT NULL,
  `adminId` VARCHAR(125) NOT NULL,
  PRIMARY KEY (`postId`));
