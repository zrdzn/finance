package dev.zrdzn.finance.backend.common.application

import dev.zrdzn.finance.backend.common.authentication.infrastructure.AuthenticationFilter
import dev.zrdzn.finance.backend.common.authentication.token.TokenService
import dev.zrdzn.finance.backend.common.user.UserService
import java.time.Clock
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
class FinanceSecurityConfiguration(
    private val tokenService: TokenService,
    private val userService: UserService,
    private val clock: Clock
) {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain =
        http
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/authentication/register").permitAll()
                    .requestMatchers("/api/authentication/login").permitAll()
                    .requestMatchers("/swagger").permitAll()
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
                                allowedOrigins = listOf("http://localhost:3000")
                                allowedMethods = listOf("*")
                                allowedHeaders = listOf("*")
                                allowCredentials = true
                            }
                        )
                    }
                )
            }
            .addFilterBefore(
                AuthenticationFilter(tokenService, userService, clock),
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