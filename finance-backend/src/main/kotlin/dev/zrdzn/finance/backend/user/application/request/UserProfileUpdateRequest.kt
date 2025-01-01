package dev.zrdzn.finance.backend.user.application.request

data class UserProfileUpdateRequest(
    val username: String,
    val decimalSeparator: String,
    val groupSeparator: String
)
