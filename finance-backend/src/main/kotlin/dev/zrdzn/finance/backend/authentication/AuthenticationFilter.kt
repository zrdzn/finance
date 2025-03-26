package dev.zrdzn.finance.backend.authentication

import dev.zrdzn.finance.backend.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.token.TokenService
import dev.zrdzn.finance.backend.token.dto.AccessTokenCreateRequest
import jakarta.servlet.FilterChain
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.time.Clock
import java.time.Instant
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.web.filter.OncePerRequestFilter

class AuthenticationFilter(
    private val tokenService: TokenService,
    private val clock: Clock
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authenticationHeader = request.getHeader("Authorization") ?: ""

        var accessToken: String
        // check if there is an access token provided
        if (authenticationHeader.startsWith("Bearer ")) {
            accessToken = authenticationHeader.substring(7)
        } else {
            val cookie = request.cookies?.find { it.name == TOKEN_COOKIE_NAME }
            if (cookie == null) {
                filterChain.doFilter(request, response)
                return
            }

            accessToken = cookie.value
        }

        val accessTokenDetails = tokenService.getAccessTokenDetails(accessToken)

        val now = Instant.now(clock)

        // check if the access token is expired
        if (accessTokenDetails.expiresAt.isBefore(now)) {
            val refreshToken = tokenService.getRefreshToken(accessTokenDetails.refreshTokenId)
            // check if the refresh token is expired
            if (refreshToken == null || refreshToken.expiresAt.isBefore(now)) {
                // remove the refresh token from the database
                tokenService.removeRefreshToken(accessTokenDetails.refreshTokenId)

                filterChain.doFilter(request, response)
                return
            }

            // create a new access token
            accessToken = tokenService.createAccessToken(
                AccessTokenCreateRequest(
                    userId = refreshToken.userId,
                    refreshTokenId = refreshToken.id,
                    email = accessTokenDetails.email
                )
            ).value

            val cookie = Cookie(TOKEN_COOKIE_NAME, accessToken)
            cookie.secure = true
            cookie.isHttpOnly = true
            response.addCookie(cookie)
        }

        if (SecurityContextHolder.getContext().authentication == null) {
            // we pass user id only, because very often in endpoints we don't need the whole user object
            val authenticationToken =
                UsernamePasswordAuthenticationToken(accessTokenDetails.userId, accessToken, emptyList())
            authenticationToken.details = WebAuthenticationDetailsSource().buildDetails(request)

            val context = SecurityContextHolder.createEmptyContext()
            context.authentication = authenticationToken

            SecurityContextHolder.setContext(context)
        }

        filterChain.doFilter(request, response)
    }

}