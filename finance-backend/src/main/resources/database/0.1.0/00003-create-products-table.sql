--liquibase formatted sql
--changeset finance:3
create table "products"
(
    "id"          serial,
    "name"        varchar(100) not null,
    "category_id" int not null,
    constraint "pk_products" primary key ("id"),
    constraint "fk_products_categories" foreign key ("category_id") references "categories" ("id")
);