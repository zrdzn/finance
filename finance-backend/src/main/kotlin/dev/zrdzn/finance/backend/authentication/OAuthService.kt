package dev.zrdzn.finance.backend.authentication

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService
import org.springframework.security.oauth2.core.user.OAuth2User

class OAuthService(
    private val authenticationService: AuthenticationService
) : OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private val defaultOAuthService = DefaultOAuth2UserService()

    override fun loadUser(userRequest: OAuth2UserRequest): OAuth2User {
        val oAuthUser = defaultOAuthService.loadUser(userRequest)
        val email = oAuthUser.getAttribute<String>("email")
            ?: throw IllegalStateException("OAuth user does not contain email attribute")

        authenticationService.authenticateWithOAuth(
            authenticationProvider = when(userRequest.clientRegistration.registrationId) {
                "github" -> AuthenticationProvider.GITHUB
                "google" -> AuthenticationProvider.GOOGLE
                "discord" -> AuthenticationProvider.DISCORD
                else -> throw IllegalArgumentException("Unsupported OAuth provider")
            },
            email = email
        )

        return oAuthUser
    }

}