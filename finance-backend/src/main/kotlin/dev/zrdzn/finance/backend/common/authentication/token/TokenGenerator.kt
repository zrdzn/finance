package dev.zrdzn.finance.backend.common.authentication.token

fun createRandomToken(): String {
    val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
    return (30..30)
        .map { allowedChars.random() }
        .joinToString("")
}