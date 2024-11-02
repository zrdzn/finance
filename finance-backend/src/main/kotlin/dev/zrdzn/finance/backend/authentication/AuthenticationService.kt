package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.authentication.api.*
import dev.zrdzn.finance.backend.authentication.token.TokenId
import dev.zrdzn.finance.backend.authentication.token.TokenService
import dev.zrdzn.finance.backend.authentication.token.api.AccessTokenCreateRequest
import dev.zrdzn.finance.backend.authentication.token.api.AccessTokenResponse
import dev.zrdzn.finance.backend.authentication.token.api.RefreshTokenCreateRequest
import dev.zrdzn.finance.backend.authentication.token.api.RefreshTokenCreateResponse
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.api.UserWithPasswordResponse
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.transaction.annotation.Transactional
import java.time.Clock
import java.time.Instant

open class AuthenticationService(
    private val userService: UserService,
    private val tokenService: TokenService,
    private val passwordEncoder: PasswordEncoder,
    private val clock: Clock,
    private val authenticationAttemptRepository: AuthenticationAttemptRepository
) {

    private val logger = LoggerFactory.getLogger(AuthenticationService::class.java)

    @Transactional(noRollbackFor = [
        AuthenticationCredentialsInvalidException::class,
        AuthenticationTotpRequiredException::class,
        AuthenticationTotpInvalidException::class
    ])
    open fun authenticate(authenticationLoginRequest: AuthenticationLoginRequest, ipAddress: String): AccessTokenResponse {
        // validate password and create authentication attempt
        val (authenticationAttempt, user) = getValidatedUser(authenticationLoginRequest, ipAddress)

        // check if the user has two-factor authentication enabled
        if (user.totpSecret != null) {
            // check if the user is trying to authenticate from the same IP address
            if (!doesIpAddressExistByUserId(user.id, ipAddress)) {
                // check if the user provided a one-time password
                if (authenticationLoginRequest.oneTimePassword == null) {
                    throw AuthenticationTotpRequiredException()
                }

                // validate the one-time password
                if (!userService.verifyUserTwoFactorCode(user.totpSecret, authenticationLoginRequest.oneTimePassword)) {
                    throw AuthenticationTotpInvalidException()
                }
            }
        }

        val refreshToken = createRefreshToken(user.id)
        val accessToken = createAccessToken(user, refreshToken.id)

        updateAuthenticationAttempt(authenticationAttempt.id!!, authenticatedAt = Instant.now(clock))

        return accessToken
    }

    @Transactional
    open fun logout(accessToken: String) =
        tokenService.removeRefreshToken(tokenService.getAccessTokenDetails(accessToken).refreshTokenId)

    @Transactional(readOnly = true)
    open fun getAuthenticationDetailsByUserId(userId: UserId): AuthenticationDetailsResponse =
        userService.getUserById(userId)
            .let {
                AuthenticationDetailsResponse(
                    email = it.email,
                    username = it.username,
                    verified = it.verified,
                    isTwoFactorEnabled = it.isTwoFactorEnabled
                )
            }

    @Transactional
    open fun createAuthenticationAttempt(userId: UserId, ipAddress: String) =
        authenticationAttemptRepository.save(
            AuthenticationAttempt(
                id = null,
                userId = userId,
                ipAddress = ipAddress,
                attemptedAt = Instant.now(clock),
                authenticatedAt = null
            )
        )

    @Transactional
    open fun updateAuthenticationAttempt(id: Int, authenticatedAt: Instant) {
        val authenticationAttempt = authenticationAttemptRepository.findById(id) ?: throw AuthenticationAttemptNotFoundException()

        authenticationAttempt.authenticatedAt = authenticatedAt

        logger.info("Authentication attempt with id {} updated", id)
    }

    @Transactional(readOnly = true)
    open fun doesIpAddressExistByUserId(userId: UserId, ipAddress: String): Boolean =
        authenticationAttemptRepository.doesIpAddressExistByUserId(userId, ipAddress)

    @Transactional
    open fun createRefreshToken(userId: Int): RefreshTokenCreateResponse =
        tokenService.createRefreshToken(RefreshTokenCreateRequest(userId))

    @Transactional
    open fun createAccessToken(
        userWithPasswordResponse: UserWithPasswordResponse,
        refreshTokenId: TokenId
    ): AccessTokenResponse =
        tokenService
            .createAccessToken(
                AccessTokenCreateRequest(
                    userId = userWithPasswordResponse.id,
                    refreshTokenId = refreshTokenId,
                    email = userWithPasswordResponse.email
                )
            )
            .let { tokenService.getAccessTokenDetails(it.value) }

    @Transactional
    open fun getValidatedUser(authenticationLoginRequest: AuthenticationLoginRequest, ipAddress: String): Pair<AuthenticationAttempt, UserWithPasswordResponse> {
        val user = userService.getUserWithPasswordByEmail(authenticationLoginRequest.email)

        val authenticationAttempt = createAuthenticationAttempt(userId = user.id, ipAddress = ipAddress)

        logger.info("There was an authentication attempt with id {}", authenticationAttempt.id)

        if (!passwordEncoder.matches(authenticationLoginRequest.password, user.password)) {
            throw AuthenticationCredentialsInvalidException()
        }

        return authenticationAttempt to user
    }

}
