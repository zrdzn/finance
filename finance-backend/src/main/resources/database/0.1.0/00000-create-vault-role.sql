--liquibase formatted sql
--changeset finance:0
CREATE TYPE "vault_role" AS ENUM (
    'OWNER',
    'MANAGER',
    'MEMBER'
);