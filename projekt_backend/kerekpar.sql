
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role  ENUM("admin", "user") DEFAULT 'user'
);


CREATE TABLE Addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    type ENUM('szallitasi', 'szamlazasi'),
    iranyitoszam VARCHAR(10),
    city VARCHAR(50),
    street_number VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);


CREATE TABLE Products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    maker VARCHAR(50),
    price INT NOT NULL,
   stock_number INT DEFAULT 0,
   picUrl VARCHAR(200),
   description VARCHAR(256)
);

CREATE TABLE Orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    u_id INT,
    delivery_addr_id INT,
    billing_addr_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50),
    FOREIGN KEY (u_id) REFERENCES Users(id),
    FOREIGN KEY (delivery_addr_id) REFERENCES Addresses(id),
    FOREIGN KEY (billing_addr_id) REFERENCES Addresses(id)
);


CREATE TABLE Order_Products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    o_id INT,
    p_id INT,
    quantity INT NOT NULL,
    sell_price INT NOT NULL, 
    FOREIGN KEY (o_id) REFERENCES Orders(id),
    FOREIGN KEY (p_id) REFERENCES Products(id)
);




CREATE TABLE Szerviz_DateTimes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_date DATETIME NOT NULL,
    usr_id INT DEFAULT NULL,
    service_name VARCHAR(100) DEFAULT NULL,
    service_price INT,
    problem_description TEXT DEFAULT NULL,
    FOREIGN KEY (usr_id) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE FUNCTION pwd_encrypt_user(pwd VARCHAR(100))
RETURNS VARCHAR(255) DETERMINISTIC
RETURN SHA2(CONCAT(pwd, "sozva"),256);

CREATE TRIGGER insert_users BEFORE insert on Users
FOR EACH ROW SET new.password = pwd_encrypt_user(new.password);




CREATE FUNCTION userlogin(username VARCHAR(100),pwd VARCHAR(100))
RETURNS INT DETERMINISTIC
BEGIN
DECLARE ok INT;
SET ok = 0;
select id into ok from Users where Users.username = username and Users.password =  pwd_encrypt_user(pwd);
RETURN ok;
End;




INSERT INTO Users VALUES(
    NULL, "adamczirjak", "adamczirjak@gmail.com", "Titok123", "user"
);

INSERT INTO Users VALUES(
    null, "haha", "haha@bolyai.hu", "Tiktok123", "admin"
)