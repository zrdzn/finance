--liquibase formatted sql
--changeset finance:0
CREATE TYPE "schedule_interval" AS ENUM (
    'HOUR',
    'DAY',
    'WEEK',
    'MONTH',
    'YEAR'
);