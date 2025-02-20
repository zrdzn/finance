package dev.zrdzn.finance.backend.authentication.application

import dev.zrdzn.finance.backend.authentication.application.error.AuthenticationAttemptNotFoundError
import dev.zrdzn.finance.backend.authentication.application.error.AuthenticationCredentialsInvalidError
import dev.zrdzn.finance.backend.authentication.application.error.AuthenticationTotpInvalidError
import dev.zrdzn.finance.backend.authentication.application.error.AuthenticationTotpRequiredError
import dev.zrdzn.finance.backend.authentication.application.request.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.authentication.domain.AuthenticationAttempt
import dev.zrdzn.finance.backend.authentication.domain.AuthenticationAttemptRepository
import dev.zrdzn.finance.backend.token.application.TokenService
import dev.zrdzn.finance.backend.token.application.request.AccessTokenCreateRequest
import dev.zrdzn.finance.backend.token.application.request.RefreshTokenCreateRequest
import dev.zrdzn.finance.backend.token.application.response.AccessTokenResponse
import dev.zrdzn.finance.backend.token.application.response.RefreshTokenResponse
import dev.zrdzn.finance.backend.user.application.UserService
import dev.zrdzn.finance.backend.user.application.response.UserResponse
import dev.zrdzn.finance.backend.user.application.response.UserWithPasswordResponse
import java.time.Clock
import java.time.Instant
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthenticationService(
    private val userService: UserService,
    private val tokenService: TokenService,
    private val passwordEncoder: PasswordEncoder,
    private val clock: Clock,
    private val authenticationAttemptRepository: AuthenticationAttemptRepository
) {

    @Transactional(noRollbackFor = [
        AuthenticationCredentialsInvalidError::class,
        AuthenticationTotpRequiredError::class,
        AuthenticationTotpInvalidError::class
    ])
    fun authenticate(authenticationLoginRequest: AuthenticationLoginRequest, ipAddress: String): AccessTokenResponse {
        // validate password and create authentication attempt
        val (authenticationAttempt, user) = getValidatedUser(authenticationLoginRequest, ipAddress)

        // check if the user has two-factor authentication enabled
        if (user.totpSecret != null) {
            // check if the user is trying to authenticate from the same IP address
            if (!doesIpAddressExist(user.id, ipAddress)) {
                // check if the user provided a one-time password
                if (authenticationLoginRequest.oneTimePassword == null) {
                    throw AuthenticationTotpRequiredError()
                }

                // validate the one-time password
                if (!userService.verifyUserTwoFactorCode(user.totpSecret, authenticationLoginRequest.oneTimePassword)) {
                    throw AuthenticationTotpInvalidError()
                }
            }
        }

        val refreshToken = createRefreshToken(user.id)
        val accessToken = createAccessToken(user, refreshToken.id)

        updateAuthenticationAttempt(authenticationAttempt.id!!, authenticatedAt = Instant.now(clock))

        return accessToken
    }

    @Transactional
    fun logout(accessToken: String) =
        tokenService.removeRefreshToken(tokenService.getAccessTokenDetails(accessToken).refreshTokenId)

    @Transactional(readOnly = true)
    fun getAuthenticationDetails(userId: Int): UserResponse = userService.getUser(userId)

    @Transactional
    fun createAuthenticationAttempt(userId: Int, ipAddress: String) =
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
    fun updateAuthenticationAttempt(id: Int, authenticatedAt: Instant) {
        val authenticationAttempt = authenticationAttemptRepository.findById(id) ?: throw AuthenticationAttemptNotFoundError()

        authenticationAttempt.authenticatedAt = authenticatedAt
    }

    @Transactional(readOnly = true)
    fun doesIpAddressExist(userId: Int, ipAddress: String): Boolean =
        authenticationAttemptRepository.doesIpAddressExistByUserId(userId, ipAddress)

    @Transactional
    fun createRefreshToken(userId: Int): RefreshTokenResponse =
        tokenService.createRefreshToken(RefreshTokenCreateRequest(userId))

    @Transactional
    fun createAccessToken(
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
    fun getValidatedUser(authenticationLoginRequest: AuthenticationLoginRequest, ipAddress: String): Pair<AuthenticationAttempt, UserWithPasswordResponse> {
        val user = userService.getInsecureUser(authenticationLoginRequest.email) ?: throw AuthenticationCredentialsInvalidError()

        val authenticationAttempt = createAuthenticationAttempt(userId = user.id, ipAddress = ipAddress)

        if (!passwordEncoder.matches(authenticationLoginRequest.password, user.password)) {
            throw AuthenticationCredentialsInvalidError()
        }

        return authenticationAttempt to user
    }

}
