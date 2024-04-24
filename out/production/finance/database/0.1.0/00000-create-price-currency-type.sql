--liquibase formatted sql
--changeset finance:0
CREATE TYPE "price_currency" AS ENUM (
    'PLN',
    'EUR',
    'USD'
);