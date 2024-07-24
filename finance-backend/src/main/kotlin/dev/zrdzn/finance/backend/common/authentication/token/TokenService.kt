package dev.zrdzn.finance.backend.common.authentication.token

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import dev.zrdzn.finance.backend.api.authentication.token.AccessTokenCreateRequest
import dev.zrdzn.finance.backend.api.authentication.token.AccessTokenCreateResponse
import dev.zrdzn.finance.backend.api.authentication.token.AccessTokenResponse
import dev.zrdzn.finance.backend.api.authentication.token.RefreshTokenCreateRequest
import dev.zrdzn.finance.backend.api.authentication.token.RefreshTokenCreateResponse
import dev.zrdzn.finance.backend.api.authentication.token.RefreshTokenResponse
import dev.zrdzn.finance.backend.api.authentication.token.TokenSignatureMismatchException
import dev.zrdzn.finance.backend.common.shared.createRandomToken
import java.time.Clock
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

class TokenService(
    private val tokenRepository: TokenRepository,
    private val clock: Clock
) {

    // TODO add actual secret
    private val algorithm = Algorithm.HMAC512("some secret")

    fun createRefreshToken(refreshTokenCreateRequest: RefreshTokenCreateRequest): RefreshTokenCreateResponse =
        tokenRepository
            .save(
                Token(
                    tokenId = createRandomToken(30),
                    userId = refreshTokenCreateRequest.userId,
                    expiresAt = Instant.now(clock).plus(14, ChronoUnit.DAYS)
                )
            )
            .let {
                RefreshTokenCreateResponse(
                    id = it.tokenId
                )
            }

    fun removeRefreshToken(tokenId: TokenId) =
        tokenRepository
            .findById(tokenId)
            ?.let {
                tokenRepository.deleteById(it.tokenId)
            }

    fun createAccessToken(accessTokenCreateRequest: AccessTokenCreateRequest): AccessTokenCreateResponse =
        Instant.now()
            .let {
                JWT.create()
                    .withClaim("userId", accessTokenCreateRequest.userId)
                    .withClaim("refreshTokenId", accessTokenCreateRequest.refreshTokenId)
                    .withSubject(accessTokenCreateRequest.email)
                    .withIssuedAt(Date.from(it))
                    .withExpiresAt(Date.from(it.plus(7, ChronoUnit.DAYS)))
                    .sign(algorithm)
            }
            .let { AccessTokenCreateResponse(it) }

    fun getRefreshTokenById(tokenId: TokenId): RefreshTokenResponse? =
        tokenRepository
            .findById(tokenId)
            ?.let {
                RefreshTokenResponse(
                    id = it.tokenId,
                    userId = it.userId,
                    expiresAt = it.expiresAt
                )
            }

    fun getAccessTokenDetails(accessToken: String): AccessTokenResponse {
        val token = JWT.decode(accessToken)
        if (algorithm.name != token.algorithm) {
            throw TokenSignatureMismatchException(accessToken)
        }

        try {
            algorithm.verify(token)
        } catch (exception: Exception) {
            throw TokenSignatureMismatchException(accessToken, exception)
        }

        return AccessTokenResponse(
            value = accessToken,
            userId = token.getClaim("userId").asInt(),
            refreshTokenId = token.getClaim("refreshTokenId").asString(),
            email = token.subject,
            expiresAt = token.expiresAtAsInstant
        )
    }

}