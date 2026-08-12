CREATE DATABASE IF NOT EXISTS Sunbeam_Online_Student_Portal_db;
USE Sunbeam_Online_Student_Portal_db;

CREATE TABLE IF NOT EXISTS Users(
    email VARCHAR(100) NOT NULL UNIQUE,
    upass VARCHAR(255) NOT NULL,
    urole ENUM('Admin', 'Student') DEFAULT 'Student'
);

CREATE TABLE IF NOT EXISTS Courses(
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    description VARCHAR(300) NOT NULL,
    fees INT,
    start_date DATE,
    end_date DATE,
    video_expire_days INT
);

CREATE TABLE IF NOT EXISTS Students(
    reg_no INT AUTO_INCREMENT PRIMARY KEY,
    sname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    course_id INT NOT NULL,
    mobile_no VARCHAR(15),
    profile_pic LONGBLOB,
    FOREIGN KEY (email) REFERENCES Users(email) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Videos(
    video_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(500) NOT NULL,
    youtube_url VARCHAR(300) NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);
