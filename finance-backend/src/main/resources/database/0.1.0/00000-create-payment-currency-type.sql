--liquibase formatted sql
--changeset finance:0
CREATE TYPE "payment_currency" AS ENUM (
    'PLN',
    'EUR',
    'USD'
);