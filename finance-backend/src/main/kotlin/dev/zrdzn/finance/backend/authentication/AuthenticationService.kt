package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.authentication.dto.AuthenticationLoginRequest
import dev.zrdzn.finance.backend.authentication.error.AuthenticationAttemptNotFoundError
import dev.zrdzn.finance.backend.authentication.error.AuthenticationCredentialsInvalidError
import dev.zrdzn.finance.backend.authentication.error.AuthenticationTotpInvalidError
import dev.zrdzn.finance.backend.authentication.error.AuthenticationTotpRequiredError
import dev.zrdzn.finance.backend.token.TokenService
import dev.zrdzn.finance.backend.token.dto.AccessTokenCreateRequest
import dev.zrdzn.finance.backend.token.dto.AccessTokenResponse
import dev.zrdzn.finance.backend.token.dto.RefreshTokenCreateRequest
import dev.zrdzn.finance.backend.token.dto.RefreshTokenResponse
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.dto.UserResponse
import dev.zrdzn.finance.backend.user.dto.UserWithPasswordResponse
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
        val accessToken = createAccessToken(
            userId = user.id,
            userEmail = user.email,
            refreshTokenId = refreshToken.id
        )

        updateAuthenticationAttempt(authenticationAttempt.id!!, authenticatedAt = Instant.now(clock))

        return accessToken
    }

    fun authenticateWithOAuth(authenticationProvider: AuthenticationProvider, email: String): Int {
        val user = userService.findUser(email)
            ?: return userService
                .createUser(
                    authenticationProvider = authenticationProvider,
                    email = email,
                    username = email.split("@").first(),
                    password = null
                )
                .id

        return user.id
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
        userId: Int,
        userEmail: String,
        refreshTokenId: String
    ): AccessTokenResponse =
        tokenService
            .createAccessToken(
                AccessTokenCreateRequest(
                    userId = userId,
                    refreshTokenId = refreshTokenId,
                    email = userEmail
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
