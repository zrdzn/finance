package dev.zrdzn.finance.backend.user.application

import dev.zrdzn.finance.backend.user.application.response.UserResponse
import dev.zrdzn.finance.backend.user.domain.User

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