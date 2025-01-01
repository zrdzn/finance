package dev.zrdzn.finance.backend.error

data class FinanceApiExceptionResponse(
    val status: Int,
    val code: String,
    val description: String
)
