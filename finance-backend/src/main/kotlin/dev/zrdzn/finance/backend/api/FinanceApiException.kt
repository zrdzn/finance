package dev.zrdzn.finance.backend.api

open class FinanceApiException(
    val status: Int,
    val code: String,
    val description: String,
    cause: Throwable? = null
) : RuntimeException(description, cause)
