--liquibase formatted sql
--changeset finance:8
create table "product_prices"
(
    "id"             serial,
    "product_id"     int not null,
    "unit_amount"    numeric(10, 2) not null,
    "currency"       varchar(3) not null,
    constraint "pk_product_prices" primary key ("id"),
    constraint "fk_product_prices_products" foreign key ("product_id") references "products" ("id")
);