--liquibase formatted sql
--changeset finance:0
CREATE TYPE "authentication_provider" AS ENUM (
    'APPLICATION',
    'GOOGLE'
);