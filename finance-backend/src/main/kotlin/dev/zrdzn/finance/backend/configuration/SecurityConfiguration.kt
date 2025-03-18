package dev.zrdzn.finance.backend.configuration

import dev.zrdzn.finance.backend.authentication.AuthenticationFilter
import dev.zrdzn.finance.backend.token.TokenService
import java.time.Clock
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
    private val clock: Clock,
    @Value("\${client.url}") private val clientUrl: String
) {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain =
        http
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/v1/authentication/register").permitAll()
                    .requestMatchers("/v1/authentication/login").permitAll()
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
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .exceptionHandling {
                it.authenticationEntryPoint { _, response, _ ->
                    response.sendError(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.reasonPhrase)
                }
            }
            .build()

}