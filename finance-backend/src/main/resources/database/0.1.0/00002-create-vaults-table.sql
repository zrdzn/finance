--liquibase formatted sql
--changeset finance:2
create table "vaults"
(
    "id"                 serial,
    "created_at"         timestamp not null,
    "public_id"          varchar(16) not null unique,
    "owner_id"           int not null,
    "name"               varchar(100) not null,
    "currency"           varchar(3) not null,
    "transaction_method" transaction_method not null,
    constraint "pk_vaults" primary key ("id"),
    constraint "fk_vaults_users" foreign key ("owner_id") references "users" ("id") on delete cascade
);