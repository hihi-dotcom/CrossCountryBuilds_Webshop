drop database if exists main;
create database main;
use main;

create table Admins (
    email varchar(64) not null unique,
    username varchar(64) not null,
    password varchar(255) not null
);

create table Products (
    id int auto_increment,
    name varchar(64) not null,
    category varchar(64),
    manufacturer varchar(64),
    description varchar(128),
    picture varchar(64),
    price int not null,
    quantity int default 0,
    primary key(id)
);

create table Visitors (
    id int auto_increment,
    name varchar(100) not null,
    shipping_address varchar(255),
    billing_address varchar(255),
    email varchar(64) not null unique,
    password varchar(255) not null,
    primary key(id)
);

create table Dates (
    Visitor_id int,
    title varchar(64) not null,
    import_date date,
    pickup_date date,
    description varchar(128),
    foreign key(Visitor_id) references Visitors(id)
);

create table Orders (
    id int auto_increment,
    Visitor_id int,
    shipping_method varchar(128),
    payment_method varchar(128),
    order_status varchar(64),
    foreign key(Visitor_id) references Visitors(id),
    primary key(id)
);

create table Products_Orders (
    Product_id int,
    Order_id int,
    quantity int not null,
    foreign key(Order_id) references Orders(id),
    foreign key(Product_id) references Products(id)
);