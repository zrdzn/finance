--liquibase formatted sql
--changeset finance:4
create table "products"
(
    "id"          serial,
    "name"        varchar(100) not null,
    "vault_id"    int not null,
    "category_id" int,
    constraint "pk_products" primary key ("id"),
    constraint "fk_products_categories" foreign key ("category_id") references "categories" ("id") on delete cascade,
    constraint "fk_products_vaults" foreign key ("vault_id") references "vaults" ("id") on delete cascade
);