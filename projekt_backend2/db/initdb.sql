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
    name varchar(64) not null unique,
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

delimiter $$

create function encrypt(p_password varchar(255))
returns varchar(255) deterministic
begin
    return sha2(concat(p_password, 'cxvyz'), 256);
end$$

create trigger create_Visitors
before insert on Visitors
for each row
begin
    set new.password = encrypt(new.password);
end$$

create trigger update_Visitors
before update on Visitors
for each row
begin
    if new.password is not null and old.password <> new.password then
        set new.password = encrypt(new.password);
    end if;
end$$

create function login(
    p_email varchar(64),
    p_password varchar(255)
)
returns int
reads sql data
begin
    declare uid int default 0;
    select id
        into uid
    from Visitors
    where
        email = p_email and
        password = encrypt(p_password);
    return uid;
end$$

create procedure registration(
    in p_name varchar(64),
    in p_email varchar(64),
    in p_password varchar(255)
)
begin
    insert into Visitors (name, email, password) values
        (p_name, p_email, p_password);
end$$

create procedure termekek(
    in p_from int, 
    in p_to int,
    in p_name varchar(64),
    in p_category varchar(64),
    in p_manufacturer varchar(64),
    in p_from_price int,
    in p_to_price int
)
begin
    declare v_limit int;
    declare v_offset int;

    set v_limit = p_to - p_from + 1;
    set v_offset = p_from;

    select
        name as név,
        category as kategória,
        manufacturer as gyártó,
        description as leírás,
        picture as kép,
        price as ár,
        quantity as mennyiség
    from Products
    where 
        (p_name is null or name = p_name) and
        (p_category is null or category = p_category) and
        (p_manufacturer is null or manufacturer = p_manufacturer) and
        (p_from_price is null or p_from_price = 0 or price >= p_from_price) and
        (p_to_price is null or p_to_price = 0 or price <= p_to_price)
    limit v_limit offset v_offset;
end$$

create procedure update_user(
    in p_id int,
    in p_name varchar(100),
    in p_shipping_address varchar(255),
    in p_billing_address varchar(255),
    in p_email varchar(64),
    in p_password varchar(255)
)
begin
    update Visitors set
        name = coalesce(p_name, name),
        shipping_address = coalesce(p_shipping_address, shipping_address),
        billing_address = coalesce(p_billing_address, billing_address),
        email = coalesce(p_email, email),
        password = coalesce(p_password, password)
    where id = p_id;
end$$

create procedure get_user( 
    in p_id int 
)
begin
    select  
        name as username,
        email,
        shipping_address,
        billing_address
    from Visitors
    where id = p_id;
end$$

create procedure create_order(

)
begin

end$$

delimiter ;
