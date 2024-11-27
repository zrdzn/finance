package dev.zrdzn.finance.backend.authentication.token

import dev.zrdzn.finance.backend.authentication.token.api.RefreshTokenResponse
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.Size
import java.time.Instant

const val TOKEN_COOKIE_NAME = "token"

@Entity
@Table(name = "authentication_tokens")
data class Token(
    @Id
    @Column(name = "token_id")
    @Size(max = 40)
    val tokenId: String,

    @Column(name = "user_id")
    val userId: Int,

    @Column(name = "expires_at")
    val expiresAt: Instant
)

fun Token.toResponse() = RefreshTokenResponse(
    id = tokenId,
    userId = userId,
    expiresAt = expiresAt
)