CREATE TABLE IF NOT EXISTS `users` (
  `email` varchar(100) NOT NULL,
  `upass` varchar(255) NOT NULL,
  `urole` enum('Admin','Student') DEFAULT 'Student',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `courses` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(100) NOT NULL,
  `description` varchar(300) NOT NULL,
  `fees` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `video_expire_days` int DEFAULT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `students` (
  `reg_no` int NOT NULL AUTO_INCREMENT,
  `sname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `course_id` int NOT NULL,
  `mobile_no` varchar(15) DEFAULT NULL,
  `profile_pic` longblob,
  PRIMARY KEY (`reg_no`),
  KEY `email` (`email`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `students_fk_users` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE,
  CONSTRAINT `students_fk_courses` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `videos` (
  `video_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` varchar(500) NOT NULL,
  `youtube_url` varchar(300) NOT NULL,
  `added_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`video_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `videos_fk_courses` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Initial Seed Data
INSERT IGNORE INTO `users` VALUES ('Admin@gmail.com','$5$rounds=535000$LFqO.Lx9q7KEQ8rt$JZQqp63yZrYseWQwKKLb3L8pY36yBT/51/6OULgJv18','Admin');
INSERT IGNORE INTO `users` VALUES ('mujawaraayan9@gmail.com','$5$rounds=535000$Kxk/M7aVzn60YfUY$pHOKrorIzhm7fDO9DK7Gbwy9fhMyCMO4M5thr3ZLry0','Student');

INSERT IGNORE INTO `courses` VALUES (1,'Python','Python Programming & Data Structures',28000,'2026-06-23','2026-07-23',30);
INSERT IGNORE INTO `courses` VALUES (2,'Web Development','Full Stack Web Development with React & Flask',35000,'2026-07-01','2026-09-30',60);

INSERT IGNORE INTO `students` VALUES (1,'Aayan Tajuddin Mujawar','mujawaraayan9@gmail.com',1,'09607871136',NULL);

INSERT IGNORE INTO `videos` VALUES (1,1,'Python Basics & Introduction','Learn Python syntax, variables, and control structures','https://www.youtube.com/embed/kqtD5dpn9C8','2026-06-23 11:05:05');
