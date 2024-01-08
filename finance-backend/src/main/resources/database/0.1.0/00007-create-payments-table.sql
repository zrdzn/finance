--liquibase formatted sql
--changeset finance:7
create table "payments"
(
    "id"          serial,
    "customer_id" int not null,
    "payed_at"    timestamp not null,
    "method"      payment_method not null,
    constraint "pk_payments" primary key ("id"),
    constraint "fk_payments_customers" foreign key ("customer_id") references "customers" ("id")
);