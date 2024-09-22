--liquibase formatted sql
--changeset finance:0
CREATE TYPE "transaction_type" AS ENUM (
    'INCOMING',
    'OUTGOING'
);