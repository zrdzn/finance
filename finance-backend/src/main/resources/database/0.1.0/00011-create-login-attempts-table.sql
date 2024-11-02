--liquibase formatted sql
--changeset finance:11
create table "login_attempts"
(
    "attempt_id"   serial primary key,
    "user_id"      int not null,
    "ip_address"   varchar(45),
    "timestamp"    timestamp not null,
    "successful"   boolean default false,
    constraint "fk_login_attempts_user_id" foreign key ("user_id") references "users" ("id") on delete cascade
);
