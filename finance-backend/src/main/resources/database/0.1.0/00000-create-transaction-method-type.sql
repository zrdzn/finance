--liquibase formatted sql
--changeset finance:0
CREATE TYPE "transaction_method" AS ENUM (
    'CARD',
    'BLIK',
    'CASH'
);