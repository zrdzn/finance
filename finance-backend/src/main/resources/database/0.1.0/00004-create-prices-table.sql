--liquibase formatted sql
--changeset finance:4
create table "prices"
(
    "id"          serial,
    "unit_amount" numeric(10, 2) not null,
    "price_currency"    price_currency not null,
    constraint "pk_prices" primary key ("id")
);