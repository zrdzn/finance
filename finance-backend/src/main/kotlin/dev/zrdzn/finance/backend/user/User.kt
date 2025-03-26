package dev.zrdzn.finance.backend.user

import dev.zrdzn.finance.backend.authentication.AuthenticationProvider
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.Size
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType

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
    var password: String?,

    @Column(name = "verified")
    var verified: Boolean,

    @Column(name = "totp_secret")
    var totpSecret: String?,

    @Column(name = "decimal_separator")
    var decimalSeparator: String,

    @Column(name = "group_separator")
    var groupSeparator: String,

    @Column(columnDefinition = "authentication_provider")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val authenticationProvider: AuthenticationProvider
)