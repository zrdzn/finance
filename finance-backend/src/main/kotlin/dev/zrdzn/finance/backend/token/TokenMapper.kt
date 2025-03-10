package dev.zrdzn.finance.backend.token

import dev.zrdzn.finance.backend.token.dto.RefreshTokenResponse

object TokenMapper {

    fun Token.toResponse() = RefreshTokenResponse(
        id = tokenId,
        userId = userId,
        expiresAt = expiresAt
    )

}