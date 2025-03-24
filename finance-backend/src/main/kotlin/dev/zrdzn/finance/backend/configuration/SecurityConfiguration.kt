package dev.zrdzn.finance.backend.configuration

import dev.zrdzn.finance.backend.authentication.AuthenticationFilter
import dev.zrdzn.finance.backend.authentication.AuthenticationService
import dev.zrdzn.finance.backend.authentication.OAuthService
import dev.zrdzn.finance.backend.authentication.OAuthSuccessHandler
import dev.zrdzn.finance.backend.token.TokenService
import dev.zrdzn.finance.backend.user.UserService
import java.time.Clock
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@EnableWebSecurity
@Configuration
class SecurityConfiguration(
    private val tokenService: TokenService,
    private val authenticationService: AuthenticationService,
    private val userService: UserService,
    private val clock: Clock,
    @Value("\${client.url}") private val clientUrl: String
) {

    private val logger = LoggerFactory.getLogger(SecurityConfiguration::class.java)

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain =
        http
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/v1/authentication/register").permitAll()
                    .requestMatchers("/v1/authentication/login").permitAll()
                    .requestMatchers("/v1/oauth/**").permitAll()
                    .requestMatchers("/swagger").permitAll()
                    .requestMatchers("/swagger-ui.html").permitAll()
                    .requestMatchers("/swagger-ui/**").permitAll()
                    .requestMatchers("/v3/api-docs").permitAll()
                    .requestMatchers("/v3/api-docs/**").permitAll()
                    .requestMatchers("/webjars/**").permitAll()
                    .anyRequest().authenticated()
            }
            .csrf { it.disable() }
            .cors {
                it.configurationSource(
                    UrlBasedCorsConfigurationSource().apply {
                        registerCorsConfiguration(
                            "/**",
                            CorsConfiguration().apply {
                                allowedOrigins = listOf(clientUrl)
                                allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS")
                                allowedHeaders = listOf(
                                    "Content-Type",
                                    "Accept",
                                    "Authorization",
                                    "Origin",
                                    "Access-Control-Request-Method",
                                    "Access-Control-Request-Headers"
                                )
                                allowCredentials = true
                            }
                        )
                    }
                )
            }
            .addFilterBefore(
                AuthenticationFilter(tokenService, clock),
                UsernamePasswordAuthenticationFilter::class.java
            )
            .oauth2Login { login ->
                login
                    .userInfoEndpoint { it.userService(OAuthService(authenticationService = authenticationService)) }
                    .authorizationEndpoint { it.baseUri("/v1/oauth/authorize") }
                    .redirectionEndpoint { it.baseUri("/v1/oauth/redirect/*") }
                    .successHandler(
                        OAuthSuccessHandler(
                            authenticationService = authenticationService,
                            userService = userService,
                            clientUrl = clientUrl
                        )
                    )
                    .failureHandler { _, response, exception ->
                        logger.debug("(OAuth) Authentication failed", exception)
                        response.sendRedirect("${clientUrl}/login")
                    }
            }
            .exceptionHandling {
                it.authenticationEntryPoint { _, response, _ ->
                    response.sendError(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.reasonPhrase)
                }
            }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .build()

}