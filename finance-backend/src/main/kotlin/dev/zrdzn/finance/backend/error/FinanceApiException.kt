package dev.zrdzn.finance.backend.error

open class FinanceApiException(
    val status: Int,
    val code: String,
    val description: String,
    cause: Throwable? = null
) : RuntimeException(description, cause)
