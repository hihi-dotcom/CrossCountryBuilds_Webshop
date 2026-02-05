CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE address_type AS ENUM ('szallitasi', 'szamlazasi');

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    reset_token VARCHAR(255) DEFAULT NULL,
    reset_token_expires TIMESTAMP DEFAULT NULL
);

CREATE TABLE Cities (
    zip_code VARCHAR(10) PRIMARY KEY,
    city_name VARCHAR(50) NOT NULL
);

CREATE TABLE Addresses (
    id SERIAL PRIMARY KEY ,
    user_id INT,
    type address_type,
    zip_code VARCHAR(10),
    street_number VARCHAR(255),

    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (zip_code) REFERENCES Cities(zip_code)
);

CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    maker VARCHAR(50),
    price INT NOT NULL,
    stock_number INT DEFAULT 0,
    picUrl VARCHAR(200),
    description VARCHAR(256)
);

CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    u_id INT,
    delivery_addr_id INT,
    billing_addr_id INT,
    payment_Method VARCHAR(50),
    delivery_Method VARCHAR(50),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'készítés alatt',
    FOREIGN KEY (u_id) REFERENCES Users(id),
    FOREIGN KEY (delivery_addr_id) REFERENCES Addresses(id),
    FOREIGN KEY (billing_addr_id) REFERENCES Addresses(id)
);

CREATE TABLE Order_Products (
    id SERIAL PRIMARY KEY,
    o_id INT,
    p_id INT,
    quantity INT NOT NULL,
    sell_price INT NOT NULL, 
    FOREIGN KEY (o_id) REFERENCES Orders(id),
    FOREIGN KEY (p_id) REFERENCES Products(id)
);

CREATE TABLE Service_DateTimes (
    id SERIAL PRIMARY KEY,
    usr_id INT DEFAULT NULL,
    service_id VARCHAR(100) DEFAULT NULL,
    service_date TIMESTAMP NOT NULL,
    bringback_date TIMESTAMP,
    problem_description TEXT DEFAULT NULL,
    service_price INT,
    FOREIGN KEY (usr_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION pwd_encrypt_user(pwd TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(pwd || 'sozva', 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pwd_encrypt_user_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.password := pwd_encrypt_user(NEW.password);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_users 
BEFORE INSERT ON Users
FOR EACH ROW 
EXECUTE FUNCTION pwd_encrypt_user_trigger();

CREATE OR REPLACE FUNCTION userlogin(username VARCHAR(100), pwd VARCHAR(100))
RETURNS INT AS $$
BEGIN
    DECLARE ok INT;
    ok := 0;
    SELECT id INTO ok FROM Users WHERE Users.username = username AND Users.password =  pwd_encrypt_user(pwd);
    RETURN ok;
END;
$$ LANGUAGE plpgsql;

INSERT INTO Users VALUES(
    NULL, 'adamczirjak', 'adamczirjak@gmail.com', 'Titok123', 'user'
);

INSERT INTO Users VALUES(
    null, 'haha', 'haha@bolyai.hu', 'Tiktok123', 'admin'
);