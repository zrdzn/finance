package dev.zrdzn.finance.backend.transaction.api

import org.springframework.http.HttpStatus

enum class TransactionErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "TRANSACTION_NOT_FOUND", "Transaction not found"),
    DESCRIPTION_REQUIRED(HttpStatus.BAD_REQUEST.value(), "TRANSACTION_DESCRIPTION_REQUIRED", "Transaction description is required"),
    SCHEDULE_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "SCHEDULE_NOT_FOUND", "Schedule not found"),
}