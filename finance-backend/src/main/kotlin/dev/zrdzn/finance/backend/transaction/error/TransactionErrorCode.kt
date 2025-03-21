package dev.zrdzn.finance.backend.transaction.error

import org.springframework.http.HttpStatus

enum class TransactionErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "TRANSACTION_NOT_FOUND", "Transaction not found"),
    DESCRIPTION_REQUIRED(HttpStatus.BAD_REQUEST.value(), "TRANSACTION_DESCRIPTION_REQUIRED", "Transaction description is required"),
    PRICE_REQUIRED(HttpStatus.BAD_REQUEST.value(), "TRANSACTION_PRICE_REQUIRED", "Transaction price is required"),
    IMPORT_MAPPING_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "TRANSACTION_IMPORT_MAPPING_NOT_FOUND", "Some of the mappings are not found"),
    IMPORT_FILE_EMPTY(HttpStatus.BAD_REQUEST.value(), "TRANSACTION_IMPORT_FILE_EMPTY", "Import file is empty"),
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "TRANSACTION_PRODUCT_NOT_FOUND", "Transaction product not found")
}
