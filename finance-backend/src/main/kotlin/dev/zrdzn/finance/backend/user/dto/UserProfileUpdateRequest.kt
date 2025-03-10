package dev.zrdzn.finance.backend.user.dto

data class UserProfileUpdateRequest(
    val username: String,
    val decimalSeparator: String,
    val groupSeparator: String
)
