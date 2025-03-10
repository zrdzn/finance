package dev.zrdzn.finance.backend.user

import dev.zrdzn.finance.backend.user.dto.UserResponse

object UserMapper {

    fun User.toResponse() = UserResponse(
        id = id!!,
        email = email,
        username = username,
        verified = verified,
        isTwoFactorEnabled = totpSecret != null,
        decimalSeparator = decimalSeparator,
        groupSeparator = groupSeparator
    )

}