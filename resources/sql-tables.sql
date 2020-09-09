CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(60) UNIQUE,
    email VARCHAR(60) UNIQUE,
    password VARCHAR(60)
);

CREATE TABLE messages (
    user_id INT PRIMARY KEY,
    message VARCHAR(256),
    FOREIGN KEY (user_id) references users(id)
);