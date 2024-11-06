package dev.zrdzn.finance.backend.api

data class FinanceApiExceptionResponse(
    val status: Int,
    val code: String,
    val description: String
)
