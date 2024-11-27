package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.authentication.api.AuthenticationAttemptNotFoundException
import dev.zrdzn.finance.backend.authentication.api.AuthenticationCredentialsInvalidException
import dev.zrdzn.finance.backend.authentication.api.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.authentication.api.AuthenticationTotpInvalidException
import dev.zrdzn.finance.backend.authentication.api.AuthenticationTotpRequiredException
import dev.zrdzn.finance.backend.authentication.token.TokenService
import dev.zrdzn.finance.backend.authentication.token.api.AccessTokenCreateRequest
import dev.zrdzn.finance.backend.authentication.token.api.AccessTokenResponse
import dev.zrdzn.finance.backend.authentication.token.api.RefreshTokenCreateRequest
import dev.zrdzn.finance.backend.authentication.token.api.RefreshTokenResponse
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.api.UserResponse
import dev.zrdzn.finance.backend.user.api.UserWithPasswordResponse
import java.time.Clock
import java.time.Instant
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.transaction.annotation.Transactional

open class AuthenticationService(
    private val userService: UserService,
    private val tokenService: TokenService,
    private val passwordEncoder: PasswordEncoder,
    private val clock: Clock,
    private val authenticationAttemptRepository: AuthenticationAttemptRepository
) {

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
            if (!doesIpAddressExist(user.id, ipAddress)) {
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
    open fun getAuthenticationDetails(userId: Int): UserResponse = userService.getUser(userId)

    @Transactional
    open fun createAuthenticationAttempt(userId: Int, ipAddress: String) =
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
    }

    @Transactional(readOnly = true)
    open fun doesIpAddressExist(userId: Int, ipAddress: String): Boolean =
        authenticationAttemptRepository.doesIpAddressExistByUserId(userId, ipAddress)

    @Transactional
    open fun createRefreshToken(userId: Int): RefreshTokenResponse =
        tokenService.createRefreshToken(RefreshTokenCreateRequest(userId))

    @Transactional
    open fun createAccessToken(
        userWithPasswordResponse: UserWithPasswordResponse,
        refreshTokenId: String
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
        val user = userService.getInsecureUser(authenticationLoginRequest.email)

        val authenticationAttempt = createAuthenticationAttempt(userId = user.id, ipAddress = ipAddress)

        if (!passwordEncoder.matches(authenticationLoginRequest.password, user.password)) {
            throw AuthenticationCredentialsInvalidException()
        }

        return authenticationAttempt to user
    }

}
