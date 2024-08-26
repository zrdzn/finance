--liquibase formatted sql
--changeset finance:8
create table "vault_members"
(
    "id"         serial,
    "vault_id"   int        not null,
    "user_id"    int        not null,
    "vault_role" vault_role not null,
    constraint "pk_vault_members" primary key ("id"),
    constraint "fk_vault_members_vaults" foreign key ("vault_id") references "vaults" ("id") on delete cascade,
    constraint "fk_vault_members_users" foreign key ("user_id") references "users" ("id") on delete cascade
);