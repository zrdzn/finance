package dev.zrdzn.finance.backend.token.application

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import dev.zrdzn.finance.backend.shared.createRandomToken
import dev.zrdzn.finance.backend.token.application.TokenMapper.toResponse
import dev.zrdzn.finance.backend.token.application.error.TokenSignatureMismatchException
import dev.zrdzn.finance.backend.token.application.request.AccessTokenCreateRequest
import dev.zrdzn.finance.backend.token.application.request.RefreshTokenCreateRequest
import dev.zrdzn.finance.backend.token.application.response.AccessTokenResponse
import dev.zrdzn.finance.backend.token.application.response.RefreshTokenResponse
import dev.zrdzn.finance.backend.token.domain.Token
import dev.zrdzn.finance.backend.token.domain.TokenRepository
import java.time.Clock
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Date
import org.springframework.stereotype.Service

@Service
class TokenService(
    private val tokenRepository: TokenRepository,
    private val clock: Clock
) {

    // TODO add actual secret
    private val algorithm = Algorithm.HMAC512("some secret")

    fun createRefreshToken(refreshTokenCreateRequest: RefreshTokenCreateRequest): RefreshTokenResponse =
        tokenRepository
            .save(
                Token(
                    tokenId = createRandomToken(30),
                    userId = refreshTokenCreateRequest.userId,
                    expiresAt = Instant.now(clock).plus(14, ChronoUnit.DAYS)
                )
            )
            .toResponse()

    fun removeRefreshToken(tokenId: String) =
        tokenRepository
            .findById(tokenId)
            ?.let {
                tokenRepository.deleteById(it.tokenId)
            }

    fun createAccessToken(accessTokenCreateRequest: AccessTokenCreateRequest): AccessTokenResponse =
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
            .let {
                AccessTokenResponse(
                    value = it,
                    userId = accessTokenCreateRequest.userId,
                    refreshTokenId = accessTokenCreateRequest.refreshTokenId,
                    email = accessTokenCreateRequest.email,
                    expiresAt = Instant.now().plus(7, ChronoUnit.DAYS)
                )
            }

    fun getRefreshToken(tokenId: String): RefreshTokenResponse? =
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
            throw TokenSignatureMismatchException()
        }

        try {
            algorithm.verify(token)
        } catch (exception: Exception) {
            throw TokenSignatureMismatchException()
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
