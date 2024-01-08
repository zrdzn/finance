--liquibase formatted sql
--changeset finance:5
create table "prices"
(
    "id"          serial,
    "unit_amount" numeric(10, 2) not null,
    "currency"    payment_currency not null,
    constraint "pk_prices" primary key ("id")
);