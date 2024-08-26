--liquibase formatted sql
--changeset finance:9
create table "vault_invitations"
(
    "id"         serial,
    "vault_id"   int not null,
    "user_email" text not null,
    "expires_at" timestamp not null,
    constraint "pk_vault_invitations" primary key ("id"),
    constraint "fk_vault_invitations_vaults" foreign key ("vault_id") references "vaults" ("id") on delete cascade
);