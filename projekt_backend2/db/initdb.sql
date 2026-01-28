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
        password = coalesce(p_password, password)
    where id = p_id;

    if p_email is not null and p_email <> (select email from Visitors where id = p_id) then
        update Visitors set email = p_email where id = p_id;
    end if;
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
    in p_uid int
)
begin
    insert into Orders (Visitor_id) values
        (p_uid);
end$$

create procedure get_users()
begin
    select 
        id,
        name as username,
        email,
        shipping_address,
        billing_address
    from Visitors;
end$$

create procedure delete_user(
    in p_id int
)
begin
    delete from Visitors where id = p_id;
end$$

create procedure get_users_unbooked_dates()
begin
    select 
        d.Visitor_id,
        v.name,
        v.email,
        d.title,
        d.import_date,
        d.description
    from Dates d
    join Visitors v on d.Visitor_id = v.id
    where d.import_date is null;
end$$

create procedure admin_update_date(
    in p_visitor_id int,
    in p_pickup_date date,
    in p_title varchar(64),
    in p_price int
)
begin
    update Dates 
    set pickup_date = p_pickup_date,
        title = p_title
    where Visitor_id = p_visitor_id;
end$$

create procedure get_all_products()
begin
    select
        id,
        name,
        category,
        manufacturer,
        description,
        picture,
        price,
        quantity
    from Products;
end$$
create procedure get_product_by_id(
    in p_id int
)
begin
    select
        id,
        name,
        category,
        manufacturer,
        description,
        picture,
        price,
        quantity
    from Products
    where id = p_id;
end$$
create procedure insert_product(
    in p_name varchar(64),
    in p_category varchar(64),
    in p_manufacturer varchar(64),
    in p_description varchar(128),
    in p_picture varchar(64),
    in p_price int,
    in p_quantity int
)
begin
    insert into Products (name, category, manufacturer, description, picture, price, quantity)
    values (p_name, p_category, p_manufacturer, p_description, p_picture, p_price, p_quantity);
end$$
create procedure delete_product(
    in p_id int
)
begin
    delete from Products where id = p_id;
end$$

create procedure get_available_dates()
begin
    select 
        Visitor_id,
        title,
        import_date,
        description
    from Dates
    where import_date is null;
end$$

create procedure book_appointment(
    in p_visitor_id int,
    in p_import_date datetime,
    in p_description varchar(255)
)
begin
    update Dates set
        import_date = p_import_date,
        description = p_description
    where Visitor_id = p_visitor_id and import_date is null;
end$$

create procedure get_pending_appointments()
begin
    select 
        d.Visitor_id,
        v.name as username,
        d.import_date,
        d.description as problem_description,
        d.pickup_date,
        d.title as service_type
    from Dates d
    join Visitors v on d.Visitor_id = v.id
    where d.pickup_date is null;
end$$

create procedure admin_update_appointment(
    in p_visitor_id int,
    in p_pickup_date date,
    in p_title varchar(64),
    in p_price int
)
begin
    update Dates set
        pickup_date = p_pickup_date,
        title = p_title
    where Visitor_id = p_visitor_id;
end$$

create procedure add_available_date(
    in p_visitor_id int,
    in p_title varchar(64)
)
begin
    insert into Dates (Visitor_id, title) 
    values (p_visitor_id, p_title);
end$$

create procedure get_orders_for_admin()
begin
    select 
        o.id as order_id,
        o.Visitor_id,
        o.shipping_method,
        o.payment_method,
        o.order_status as status
    from Orders o
    order by o.id desc;
end$$

create procedure update_order_status(
    in p_order_id int,
    in p_status varchar(64)
)
begin
    update Orders set order_status = p_status where id = p_order_id;
end$$

create procedure delete_order(
    in p_order_id int
)
begin
    delete from Products_Orders where Order_id = p_order_id;
    delete from Orders where id = p_order_id;
end$$


create procedure delete_appointment(
    in p_id int
)
begin
    delete from Dates where id = p_id;
end$$

create procedure delete_user_by_email(
    in p_email varchar(64)
)
begin
    delete from Visitors where email = p_email;
end$$

create procedure get_appointments()
begin
    select 
        id,
        Visitor_id,
        title,
        import_date,
        pickup_date,
        description
    from Dates
    where import_date is not null;
end$$

CREATE PROCEDURE update_product(
    IN p_id INT,
    IN p_name VARCHAR(64),
    IN p_category VARCHAR(64),
    IN p_manufacturer VARCHAR(64),
    IN p_description VARCHAR(128),
    IN p_price INT,
    IN p_quantity INT
)
BEGIN
    UPDATE Products SET 
        name = p_name,
        category = p_category,
        manufacturer = p_manufacturer,
        description = p_description,
        price = p_price,
        quantity = p_quantity
    WHERE id = p_id;
END$$

CREATE PROCEDURE get_orders_by_user(
    IN p_user_id INT
)
BEGIN
    SELECT o.*, po.Product_id, po.quantity 
    FROM Orders o
    LEFT JOIN Products_Orders po ON o.id = po.Order_id
    WHERE o.Visitor_id = p_user_id;
END$$

delimiter ;