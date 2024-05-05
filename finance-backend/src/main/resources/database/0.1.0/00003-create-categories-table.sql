--liquibase formatted sql
--changeset finance:3
create table "categories"
(
    "id"       serial,
    "name"     varchar(100) not null,
    "vault_id" int not null,
    constraint "pk_categories" primary key ("id"),
    constraint "fk_categories_vaults" foreign key ("vault_id") references "vaults" ("id")
);