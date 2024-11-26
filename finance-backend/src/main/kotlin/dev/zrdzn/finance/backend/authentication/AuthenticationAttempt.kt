package dev.zrdzn.finance.backend.authentication

import jakarta.persistence.*
import java.time.Instant

@Table(name = "authentication_attempts")
data class AuthenticationAttempt(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,

    @Column(name = "user_id")
    val userId: Int,

    @Column(name = "ip_address")
    val ipAddress: String,

    @Column(name = "attempted_at")
    val attemptedAt: Instant,

    @Column(name = "authenticated_at")
    var authenticatedAt: Instant?,
)
