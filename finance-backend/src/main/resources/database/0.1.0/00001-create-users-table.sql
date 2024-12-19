--liquibase formatted sql
--changeset finance:1
create table "users"
(
    "id"                  serial,
    "email"               text not null unique,
    "username"            text not null,
    "password"            varchar(100) not null,
    "verified"            boolean default false,
    "totp_secret"         varchar(100),
    "decimal_separator"   varchar(1) not null,
    "group_separator"     varchar(1) not null,
    constraint "pk_users" primary key ("id")
);
