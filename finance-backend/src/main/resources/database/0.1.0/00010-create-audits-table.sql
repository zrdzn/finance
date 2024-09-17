--liquibase formatted sql
--changeset finance:10
create table "audits"
(
    "id"          serial,
    "created_at"  timestamp not null,
    "member_id"   int not null,
    "description" text not null,
    constraint "pk_audit" primary key ("id"),
    constraint "fk_audit_vault_members" foreign key ("member_id") references "vault_members" ("id") on delete cascade
);