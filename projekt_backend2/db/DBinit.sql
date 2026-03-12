CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(10) DEFAULT 'user',
    reset_token text DEFAULT NULL,
    reset_token_expires TIMESTAMP DEFAULT NULL
);

CREATE TABLE Addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(10),
    zip_code VARCHAR(10),
    street VARCHAR(255),
    city_name VARCHAR(50) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    manufacturer VARCHAR(50),
    price INT NOT NULL,
    stock INT DEFAULT 0,
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
    status VARCHAR(50) DEFAULT 'várakozik',

    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

INSERT INTO Users (username, email, password, role) VALUES
    ('admin', 'admin@webshop.com', 'pbkdf2_sha256:200000$3uCB1QXwCBNLrDMHQ6qk0UDREvLNNwF0lveQRma4S7Y=|UO3PTIsfRKq/DFUnyFAPOIQVVilltWy1XrzNzPLEhNw=', 'admin'),
    ('user1', 'user1@example.com', 'pbkdf2_sha256:200000$3uCB1QXwCBNLrDMHQ6qk0UDREvLNNwF0lveQRma4S7Y=|UO3PTIsfRKq/DFUnyFAPOIQVVilltWy1XrzNzPLEhNw=', 'user'),
    ('user2', 'user2@example.com', 'pbkdf2_sha256:200000$3uCB1QXwCBNLrDMHQ6qk0UDREvLNNwF0lveQRma4S7Y=|UO3PTIsfRKq/DFUnyFAPOIQVVilltWy1XrzNzPLEhNw=', 'user');

-- Add sample addresses
INSERT INTO Addresses (user_id, type, zip_code, street, city_name) VALUES
    (2, 'delivery', '1234', 'Main Street 1', 'Budapest'),
    (2, 'billing', '1234', 'Main Street 1', 'Budapest'),
    (3, 'delivery', '5678', 'Park Avenue 10', 'Debrecen'),
    (3, 'billing', '5678', 'Park Avenue 10', 'Debrecen');

-- Add sample products with local image paths
INSERT INTO Products (name, category, manufacturer, price, stock, pic_url, description) VALUES
    ('Mountain Bike Pro X1', 'Mountain Bike', 'Trek', 250000, 15, 'bike1.jpg', 'High-performance mountain bike for trails'),
    ('Mountain Bike Elite', 'Mountain Bike', 'Giant', 320000, 8, 'bike2.jpg', 'Professional mountain bike with carbon frame'),
    ('Road Bike Speedster', 'Road Bike', 'Specialized', 450000, 5, 'bike3.jpg', 'Lightweight road bike for racing'),
    ('Road Bike Aero', 'Road Bike', 'Cannondale', 380000, 12, 'bike4.jpg', 'Aerodynamic road bike for speed'),
    ('Hybrid Comfort 500', 'Hybrid', 'Scott', 180000, 20, 'bike5.jpg', 'Versatile hybrid bike for city and trail'),
    ('Hybrid Touring', 'Hybrid', 'Cube', 210000, 18, 'bike1.jpg', 'Comfortable touring hybrid bike'),
    ('Kids Bike Junior', 'Kids', 'BMX', 85000, 25, 'bike2.jpg', 'Safe and fun bike for kids'),
    ('BMX Freestyle', 'BMX', 'Mongoose', 120000, 10, 'bike3.jpg', 'Freestyle BMX for tricks and stunts'),
    ('E-Bike City', 'E-Bike', 'Bosch', 650000, 6, 'bike4.jpg', 'Electric city bike with 100km range'),
    ('E-Bike Mountain', 'E-Bike', 'Shimano', 780000, 4, 'bike5.jpg', 'Electric mountain bike for tough terrain');

-- Add sample appointments with status
-- Free appointments (user_id IS NULL) should have status 'várakozik' (waiting) and NO bringback_date
-- Booked appointments should have status 'folyamatban' (in progress) and NO bringback_date
-- Completed appointments should have status 'kész' (done), have a user, and HAVE bringback_date
INSERT INTO Service_DateTimes (user_id, service_name, service_date, bringback_date, problem_description, service_price, status) VALUES
    -- Free appointments (no user, no bringback_date)
    (NULL, 'General Service', '2025-04-01 10:00:00', NULL, NULL, NULL, 'várakozik'),
    (NULL, 'Brake Repair', '2025-04-01 14:00:00', NULL, NULL, NULL, 'várakozik'),
    (NULL, 'Wheel Alignment', '2025-04-02 09:00:00', NULL, NULL, NULL, 'várakozik'),
    (NULL, 'General Service', '2025-04-02 11:00:00', NULL, NULL, NULL, 'várakozik'),
    (NULL, 'Chain Replacement', '2025-04-03 10:00:00', NULL, NULL, NULL, 'várakozik'),
    -- One booked appointment (folyamatban) - has user but NO bringback_date yet
    (2, 'General Service', '2025-04-05 09:00:00', NULL, 'Strange noise from rear wheel', 15000, 'folyamatban'),
    -- One completed appointment (kész) - has user, price, and bringback_date
    (3, 'Brake Repair', '2025-04-06 14:00:00', '2025-04-07 18:00:00', 'Brakes not responding well', 8000, 'kész');