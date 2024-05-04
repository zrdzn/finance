package dev.zrdzn.finance.backend.common.shared

fun createRandomToken(length: Int): String {
    val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
    return (0..length)
        .map { allowedChars.random() }
        .joinToString("")
}