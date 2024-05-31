--liquibase formatted sql
--changeset finance:6
create table "payment_products"
(
    "id"          serial,
    "payment_id"  int not null,
    "product_id"  int not null,
    "unit_amount" numeric(10, 2) not null,
    "quantity"    int not null,
    constraint "pk_payment_products" primary key ("id"),
    constraint "fk_payment_products_payments" foreign key ("payment_id") references "payments" ("id"),
    constraint "fk_payment_products_products" foreign key ("product_id") references "products" ("id")
);