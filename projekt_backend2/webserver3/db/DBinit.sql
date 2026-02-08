CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE address_type AS ENUM ('delivery', 'billing');

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role user_role DEFAULT 'user',
    reset_token text DEFAULT NULL,
    reset_token_expires TIMESTAMP DEFAULT NULL
);

CREATE TABLE Addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type address_type,
    zip_code VARCHAR(10),
    street VARCHAR(255),
    city_name VARCHAR(50) NOT NULL,

    UNIQUE (user_id, type),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    maker VARCHAR(50),
    price INT NOT NULL,
    stock_number INT DEFAULT 0,
    pic_url VARCHAR(200),
    description TEXT
);

CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    delivery_addr_id INT,
    billing_addr_id INT,
    payment_method VARCHAR(50),
    delivery_method VARCHAR(50),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'készítés alatt',

    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (delivery_addr_id) REFERENCES Addresses(id),
    FOREIGN KEY (billing_addr_id) REFERENCES Addresses(id)
);

CREATE TABLE Order_Products (
    id SERIAL PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    sell_price INT NOT NULL, 

    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);

CREATE TABLE Service_DateTimes (
    id SERIAL PRIMARY KEY,
    user_id INT DEFAULT NULL,
    service_name VARCHAR(100) DEFAULT NULL,
    service_date TIMESTAMP NOT NULL,
    bringback_date TIMESTAMP,
    problem_description TEXT DEFAULT NULL,
    service_price INT,

    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);