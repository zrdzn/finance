--liquibase formatted sql
--changeset finance:7
create table "payment_prices"
(
    "id"                serial,
    "payment_id"        int not null,
    "unit_amount"       numeric(10, 2) not null,
    "price_currency"    price_currency not null,
    constraint "pk_payment_prices" primary key ("id"),
    constraint "fk_payment_prices_payments" foreign key ("payment_id") references "payments" ("id")
);