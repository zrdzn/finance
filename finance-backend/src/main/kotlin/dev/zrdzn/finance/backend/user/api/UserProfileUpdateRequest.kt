package dev.zrdzn.finance.backend.user.api

data class UserProfileUpdateRequest(
    val username: String,
    val decimalSeparator: String,
    val groupSeparator: String
)
