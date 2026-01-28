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
