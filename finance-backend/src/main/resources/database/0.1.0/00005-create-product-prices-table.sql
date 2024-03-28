--liquibase formatted sql
--changeset finance:5
create table "product_prices"
(
    "id"          serial,
    "product_id" int not null,
    "price_id"   int not null,
    constraint "pk_product_prices" primary key ("id"),
    constraint "fk_product_prices_products" foreign key ("product_id") references "products" ("id"),
    constraint "fk_product_prices_prices" foreign key ("price_id") references "prices" ("id")
);