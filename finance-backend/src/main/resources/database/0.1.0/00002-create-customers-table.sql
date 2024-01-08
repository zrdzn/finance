--liquibase formatted sql
--changeset finance:2
create table "customers"
(
    "id"          serial,
    "user_id"     int not null,
    constraint "pk_customers" primary key ("id"),
    constraint "fk_customers_users" foreign key ("user_id") references "users" ("id")
);