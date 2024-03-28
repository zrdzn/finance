package dev.zrdzn.finance.backend.common.authentication.token

import dev.zrdzn.finance.backend.common.user.UserId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.Size
import java.time.Instant

typealias TokenId = String

const val TOKEN_COOKIE_NAME = "token"

@Entity(name = "Token")
@Table(name = "authentication_tokens")
data class Token(
    @Id
    @Column(name = "token_id")
    @Size(max = 40)
    val tokenId: TokenId,

    @Column(name = "user_id")
    val userId: UserId,

    @Column(name = "expires_at")
    val expiresAt: Instant
)