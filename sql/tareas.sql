CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

CREATE TABLE IF NOT EXISTS tasks (
    id INT auto_increment primary key,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed TINYINT(1) DEFAULT 0, 
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP default current_timestamp on update current_timestamp
) engine=InnoDB