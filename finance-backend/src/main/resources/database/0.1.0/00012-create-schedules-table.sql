--liquibase formatted sql
--changeset finance:12
create table "schedules"
(
    "id"                serial primary key,
    "transaction_id"    int not null,
    "description"       varchar(255) not null,
    "next_execution"    timestamp not null,
    "schedule_interval" schedule_interval not null,
    "interval_value"    int not null,
    constraint "fk_schedules_transaction_id" foreign key ("transaction_id") references "transactions" ("id") on delete cascade
);
