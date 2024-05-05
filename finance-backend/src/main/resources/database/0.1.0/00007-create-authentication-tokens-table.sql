--liquibase formatted sql
--changeset finance:7
create table "authentication_tokens"
(
    "token_id"    varchar(40) not null,
    "user_id"     int not null,
    "expires_at"   timestamp not null,
    constraint "pk_authentication_tokens" primary key ("token_id"),
    constraint "fk_authentication_tokens_user_id" foreign key ("user_id") references "users" ("id")
);