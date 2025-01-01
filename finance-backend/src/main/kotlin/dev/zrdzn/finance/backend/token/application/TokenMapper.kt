package dev.zrdzn.finance.backend.token.application

import dev.zrdzn.finance.backend.token.application.response.RefreshTokenResponse
import dev.zrdzn.finance.backend.token.domain.Token

object TokenMapper {

    fun Token.toResponse() = RefreshTokenResponse(
        id = tokenId,
        userId = userId,
        expiresAt = expiresAt
    )

}