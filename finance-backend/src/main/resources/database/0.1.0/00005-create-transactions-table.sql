--liquibase formatted sql
--changeset finance:5
create table "transactions"
(
    "id"                 serial,
    "created_at"         timestamp not null,
    "user_id"            int not null,
    "vault_id"           int not null,
    "transaction_method" transaction_method not null,
    "description"        text,
    "total"              numeric(10, 2) not null,
    "currency"           varchar(3) not null,
    constraint "pk_transactions" primary key ("id"),
    constraint "fk_transactions_users" foreign key ("user_id") references "users" ("id") on delete cascade,
    constraint "fk_transactions_vaults" foreign key ("vault_id") references "vaults" ("id") on delete cascade
);