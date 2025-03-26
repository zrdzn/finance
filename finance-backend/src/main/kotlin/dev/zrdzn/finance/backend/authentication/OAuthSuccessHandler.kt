package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.user.UserService
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.web.authentication.AuthenticationSuccessHandler

class OAuthSuccessHandler(
    private val authenticationService: AuthenticationService,
    private val userService: UserService,
    private val clientUrl: String
) : AuthenticationSuccessHandler {

    private val logger = LoggerFactory.getLogger(OAuthSuccessHandler::class.java)

    override fun onAuthenticationSuccess(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authentication: Authentication?
    ) {
        if (authentication == null || !authentication.isAuthenticated) {
            logger.error("Something went wrong with OAuth authentication")
            return
        }

        val oAuthToken = authentication as OAuth2AuthenticationToken

        val email = oAuthToken.principal.attributes["email"].toString()

        val userId = authenticationService.authenticateWithOAuth(
            authenticationProvider = when(oAuthToken.authorizedClientRegistrationId) {
                "github" -> AuthenticationProvider.GITHUB
                "google" -> AuthenticationProvider.GOOGLE
                "discord" -> AuthenticationProvider.DISCORD
                else -> throw IllegalArgumentException("Unsupported OAuth provider")
            },
            email = email
        )

        val user = userService.findUser(userId)
        if (user == null) {
            logger.error("User not found with email '$email' taken from OAuth token")
            return
        }

        val refreshToken = authenticationService.createRefreshToken(user.id)
        val accessToken = authenticationService.createAccessToken(refreshToken.userId, user.email, refreshToken.id)

        val cookie = Cookie(TOKEN_COOKIE_NAME, accessToken.value)
        cookie.path = "/"
        cookie.secure = true
        cookie.isHttpOnly = true
        response.addCookie(cookie)

        response.sendRedirect("${clientUrl}/login")
    }

}