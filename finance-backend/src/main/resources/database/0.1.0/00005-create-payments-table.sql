--liquibase formatted sql
--changeset finance:5
create table "payments"
(
    "id"             serial,
    "user_id"        int not null,
    "vault_id"       int not null,
    "payed_at"       timestamp not null,
    "payment_method" payment_method not null,
    "description"    text,
    "total"          numeric(10, 2) not null,
    "currency"       varchar(3) not null,
    constraint "pk_payments" primary key ("id"),
    constraint "fk_payments_users" foreign key ("user_id") references "users" ("id") on delete cascade,
    constraint "fk_payments_vaults" foreign key ("vault_id") references "vaults" ("id") on delete cascade
);