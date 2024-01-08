--liquibase formatted sql
--changeset finance:9
create table "payment_prices"
(
    "id"          serial,
    "payment_id"  int not null,
    "price_id"    int not null,
    constraint "pk_payment_prices" primary key ("id"),
    constraint "fk_payment_prices_payments" foreign key ("payment_id") references "payments" ("id"),
    constraint "fk_payment_prices_prices" foreign key ("price_id") references "prices" ("id")
);