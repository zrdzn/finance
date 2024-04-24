--liquibase formatted sql
--changeset finance:2
create table "categories"
(
    "id"       serial,
    "name"     varchar(100) not null,
    constraint "pk_categories" primary key ("id")
);