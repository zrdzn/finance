--liquibase formatted sql
--changeset finance:0
CREATE TYPE "payment_method" AS ENUM (
    'CARD',
    'BLIK',
    'CASH'
);