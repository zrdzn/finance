--liquibase formatted sql
--changeset finance:10
create table "audits"
(
    "id"             serial,
    "created_at"     timestamp not null,
    "vault_id"       int not null,
    "user_id"        int not null,
    "audit_action"   audit_action not null,
    "description"    text not null,
    constraint "pk_audits" primary key ("id"),
    constraint "fk_audits_vaults" foreign key ("vault_id") references "vaults" ("id") on delete cascade,
    constraint "fk_audits_users" foreign key ("user_id") references "users" ("id") on delete cascade
);