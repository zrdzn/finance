package dev.zrdzn.finance.backend.error

data class FinanceApiErrorResponse(
    val status: Int,
    val code: String,
    val description: String
)
