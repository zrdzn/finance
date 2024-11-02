--liquibase formatted sql
--changeset finance:11
create table "authentication_attempts"
(
    "id"           serial primary key,
    "user_id"      int not null,
    "ip_address"   varchar(45),
    "attempted_at" timestamp not null,
    "authenticated_at" timestamp,
    constraint "fk_authentication_attempts_user_id" foreign key ("user_id") references "users" ("id") on delete cascade
);
