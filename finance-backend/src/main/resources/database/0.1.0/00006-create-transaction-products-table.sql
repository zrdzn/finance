--liquibase formatted sql
--changeset finance:6
create table "transaction_products"
(
    "id"              serial,
    "transaction_id"  int not null,
    "product_id"      int not null,
    "unit_amount"     numeric(10, 2) not null,
    "quantity"        int not null,
    constraint "pk_transaction_products" primary key ("id"),
    constraint "fk_transaction_products_transactions" foreign key ("transaction_id") references "transactions" ("id") on delete cascade,
    constraint "fk_transaction_products_products" foreign key ("product_id") references "products" ("id") on delete cascade
);