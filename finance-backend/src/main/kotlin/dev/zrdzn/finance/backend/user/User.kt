package dev.zrdzn.finance.backend.user

import dev.zrdzn.finance.backend.user.api.UserResponse
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.Size

@Entity
@Table(name = "users")
data class User(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,

    @Column(name = "email")
    var email: String,

    @Column(name = "username")
    var username: String,

    @Column(name = "password")
    @Size(max = 100)
    var password: String,

    @Column(name = "verified")
    var verified: Boolean,

    @Column(name = "totp_secret")
    var totpSecret: String?
)

fun User.toResponse() = UserResponse(
    id = id!!,
    email = email,
    username = username,
    verified = verified,
    isTwoFactorEnabled = totpSecret != null
)
