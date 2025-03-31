package dev.zrdzn.finance.backend.transaction.error

import dev.zrdzn.finance.backend.transaction.TransactionService.Companion.MAX_DESCRIPTION_LENGTH
import dev.zrdzn.finance.backend.transaction.TransactionService.Companion.MIN_DESCRIPTION_LENGTH
import dev.zrdzn.finance.backend.transaction.TransactionService.Companion.PRODUCT_NAME_MAX_LENGTH
import dev.zrdzn.finance.backend.transaction.TransactionService.Companion.PRODUCT_NAME_MIN_LENGTH
import org.springframework.http.HttpStatus

enum class TransactionErrorCode(val status: Int, val code: String, val description: String) {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), "TRANSACTION_NOT_FOUND", "Transaction not found"),
    DESCRIPTION_INVALID(HttpStatus.BAD_REQUEST.value(), "TRANSACTION_DESCRIPTION_INVALID", "Description must be between $MIN_DESCRIPTION_LENGTH and $MAX_DESCRIPTION_LENGTH characters"),
    PRICE_REQUIRED(HttpStatus.BAD_REQUEST.value(), "TRANSACTION_PRICE_REQUIRED", "Transaction price is required"),
    PRICE_NEGATIVE(HttpStatus.BAD_REQUEST.value(), "TRANSACTION_PRICE_NEGATIVE", "Transaction price cannot be negative"),
    IMPORT_MAPPING_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "TRANSACTION_IMPORT_MAPPING_NOT_FOUND", "Some of the mappings are not found"),
    IMPORT_FILE_EMPTY(HttpStatus.BAD_REQUEST.value(), "TRANSACTION_IMPORT_FILE_EMPTY", "Import file is empty"),
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "TRANSACTION_PRODUCT_NOT_FOUND", "Transaction product not found"),
    PRODUCT_NAME_INVALID(
        status = HttpStatus.BAD_REQUEST.value(),
        code = "TRANSACTION_PRODUCT_NAME_INVALID",
        description = "Product name must be between $PRODUCT_NAME_MIN_LENGTH and $PRODUCT_NAME_MAX_LENGTH characters"
    ),
    PRODUCT_PRICE_NEGATIVE(
        status = HttpStatus.BAD_REQUEST.value(),
        code = "TRANSACTION_PRODUCT_PRICE_NEGATIVE",
        description = "Product price cannot be negative"
    ),
    PRODUCT_QUANTITY_NEGATIVE(
        status = HttpStatus.BAD_REQUEST.value(),
        code = "TRANSACTION_PRODUCT_QUANTITY_NEGATIVE",
        description = "Product quantity cannot be negative"
    )
}
